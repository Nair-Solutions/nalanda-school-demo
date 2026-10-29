import { Medal } from "lucide-react";
import { judoResults2026, type MedalResult } from "@/content/achievements";
import { format, type Dictionary } from "@/i18n/get-dictionary";

const medalColour: Record<MedalResult, string> = {
  gold: "text-[#b8860b]",
  silver: "text-slate-500",
  medal: "text-[#a0612b]",
};

/**
 * Text version of the poster, so results are readable by screen readers and
 * search engines. A table from 640px; stacked rows on phones.
 */
export function ResultsTable({ dict }: { dict: Dictionary }) {
  const t = dict.achievementsData;
  const category = (age: number, kg: number) => `${format(t.under, { age })} (−${kg} kg)`;
  return (
    <div>
      <p className="text-muted mb-3 text-sm sm:hidden">{t.tableCaption}</p>
      <ul className="grid gap-2 sm:hidden" data-testid="results-list">
        {judoResults2026.map((row) => (
          <li key={row.student} className="rounded-2xl bg-white p-4">
            <p className="text-title text-navy-900 flex items-center gap-2">
              <Medal
                aria-hidden="true"
                size={20}
                className={`shrink-0 ${medalColour[row.result]}`}
              />
              <span lang="en">{row.student}</span>
            </p>
            <p className="text-ink mt-1 text-base">
              {t[row.result]} · {format(t.classLabel, { cls: row.className })} ·{" "}
              {category(row.ageGroup, row.weightKg)}
            </p>
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto rounded-2xl bg-white sm:block">
        <table className="w-full text-left text-base">
          <caption className="text-muted px-5 pt-5 text-left text-sm">{t.tableCaption}</caption>
          <thead>
            <tr className="border-line text-muted border-b text-sm">
              <th scope="col" className="px-5 py-3 font-semibold">
                {t.colStudent}
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                {t.colClass}
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                {t.colCategory}
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                {t.colResult}
              </th>
            </tr>
          </thead>
          <tbody>
            {judoResults2026.map((row) => (
              <tr key={row.student} className="border-line border-b last:border-0">
                <th scope="row" className="text-navy-900 px-5 py-3.5 font-semibold" lang="en">
                  {row.student}
                </th>
                <td className="px-5 py-3.5">{format(t.classLabel, { cls: row.className })}</td>
                <td className="px-5 py-3.5">{category(row.ageGroup, row.weightKg)}</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5">
                    <Medal aria-hidden="true" size={18} className={medalColour[row.result]} />
                    {t[row.result]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
