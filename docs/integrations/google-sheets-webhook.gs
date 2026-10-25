/**
 * Google Apps Script web app that receives website enquiries and appends them
 * to a Google Sheet. Option B in docs/deployment-guide.md.
 *
 * Setup:
 * 1. Create a Google Sheet (owned by the school account). Extensions → Apps Script.
 * 2. Paste this file. Project Settings → Script properties → add ENQUIRY_WEBHOOK_SECRET
 *    (a long random string; the same value goes into Vercel).
 * 3. Deploy → New deployment → Web app → Execute as: Me; Who has access: Anyone.
 * 4. Put the web app URL in Vercel as ENQUIRY_WEBHOOK_URL, and the secret as ENQUIRY_WEBHOOK_SECRET.
 *
 * Apps Script cannot read request headers, so the site also sends the secret in the JSON body.
 */
function doPost(e) {
  var expected = PropertiesService.getScriptProperties().getProperty("ENQUIRY_WEBHOOK_SECRET");
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond(400, "bad json");
  }
  if (!expected || data.secret !== expected) return respond(403, "forbidden");

  var sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Enquiries") ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet("Enquiries");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Received",
      "Topic",
      "Parent / guardian",
      "Mobile",
      "Email",
      "Student",
      "Class",
      "Message",
      "Language",
    ]);
  }
  // Prefix with ' so Sheets never evaluates visitor text as a formula.
  var safe = function (v) {
    return "'" + String(v || "");
  };
  sheet.appendRow([
    data.receivedAt,
    data.topic,
    safe(data.parentName),
    safe(data.phone),
    safe(data.email),
    safe(data.studentName),
    safe(data.studentClass),
    safe(data.message),
    data.locale,
  ]);
  return respond(200, "ok");
}

function respond(status, message) {
  // Apps Script web apps always answer HTTP 200, so the result is in the body:
  // the website counts an enquiry as delivered only when it receives {"ok": true}.
  return ContentService.createTextOutput(
    JSON.stringify({ ok: status === 200, message: message }),
  ).setMimeType(ContentService.MimeType.JSON);
}
