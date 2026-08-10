import type { ReactNode } from "react";

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-brand-navy">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-brand-navy/80">
        {children}
      </div>
    </section>
  );
}

export function LegalTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-brand-navy/10">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-brand-navy/5 text-left">
            {headers.map((header) => (
              <th key={header} className="px-4 py-2 font-semibold text-brand-navy">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-brand-navy/10 align-top">
              {row.map((cell, cellIndex) => (
                <td key={headers[cellIndex]} className="px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
