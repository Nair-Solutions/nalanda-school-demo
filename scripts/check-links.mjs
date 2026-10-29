#!/usr/bin/env node
/**
 * Crawl the running site from /en and /hi, verify every internal link and
 * asset returns 200, and probe external links separately.
 *
 * Usage: node scripts/check-links.mjs [baseUrl]   (default http://localhost:3100)
 *
 * External results are classified, not judged: a timeout, 403 or 429 often
 * means the site blocks automated requests, so only clear 404/410 responses
 * are reported as "broken".
 */
const base = (process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3100").replace(
  /\/$/,
  "",
);
const origin = new URL(base).origin;
const seen = new Set();
const queue = ["/en", "/hi"];
const internalFailures = [];
const external = new Map();

// Links people follow and assets they load (not <link rel="alternate"> metadata, which uses the configured site URL).
const hrefPattern = /<(?:a|img|script|source)\b[^>]*?\s(?:href|src)="([^"#]+)(?:#[^"]*)?"/g;

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const res = await fetch(base + path, { redirect: "follow" });
  if (res.status !== 200) {
    internalFailures.push(`${res.status} ${path}`);
    continue;
  }
  if (!(res.headers.get("content-type") ?? "").includes("text/html")) continue;
  const html = await res.text();
  for (const [, raw] of html.matchAll(hrefPattern)) {
    const href = raw.replace(/&amp;/g, "&");
    if (/^(mailto|tel|data):/.test(href)) continue;
    const url = new URL(href, base + path);
    if (url.origin === origin) {
      const target = url.pathname + url.search;
      if (!seen.has(target)) queue.push(target);
    } else if (url.protocol.startsWith("http")) {
      external.set(url.href, path);
    }
  }
}

console.log(`Checked ${seen.size} internal URLs.`);
if (internalFailures.length) {
  console.error("Internal failures:\n  " + internalFailures.join("\n  "));
}

if (external.size) {
  console.log(`\nExternal links (${external.size}):`);
  for (const [href, from] of external) {
    let verdict;
    try {
      const res = await fetch(href, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(10_000),
      });
      verdict =
        res.status === 404 || res.status === 410
          ? `BROKEN (${res.status})`
          : res.ok
            ? `ok (${res.status})`
            : `unverified (${res.status}, may block bots)`;
    } catch (error) {
      verdict = `unverified (${error.name === "TimeoutError" ? "timeout" : (error.cause?.code ?? error.message)})`;
    }
    console.log(`  ${verdict}  ${href}  (from ${from})`);
  }
}

process.exit(internalFailures.length ? 1 : 0);
