import { Medal } from "lucide-react";
import { judoResults2026, type MedalResult } from "@/content/achievements";
import { format, type Dictionary } from "@/i18n/get-dictionary";

const medalColour: Record<MedalResult, string> = {
  gold: "text-[#b8860b]",
  silver: "text-slate-500",
  medal: "text-[#a0612b]",
};

/** Text version of the poster, so results are readable by screen readers and search engines. */
export function ResultsTable({ dict }: { dict: Dictionary }) {
  const t = dict.achievementsData;
  return (
    <div className="border-line overflow-x-auto rounded-xl border bg-white">
      <table className="w-full min-w-[520px] text-left text-[15px]">
        <caption className="text-muted px-4 pt-4 text-left text-sm">{t.tableCaption}</caption>
        <thead>
          <tr className="border-line text-muted border-b text-sm">
            <th scope="col" className="px-4 py-3 font-semibold">
              {t.colStudent}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t.colClass}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t.colCategory}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              {t.colResult}
            </th>
          </tr>
        </thead>
        <tbody>
          {judoResults2026.map((row) => (
            <tr key={row.student} className="border-line border-b last:border-0">
              <th scope="row" className="text-navy-900 px-4 py-3 font-semibold" lang="en">
                {row.student}
              </th>
              <td className="px-4 py-3">{format(t.classLabel, { cls: row.className })}</td>
              <td className="px-4 py-3">
                {format(t.under, { age: row.ageGroup })} (−{row.weightKg} kg)
              </td>
              <td className="px-4 py-3">
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
  );
}
