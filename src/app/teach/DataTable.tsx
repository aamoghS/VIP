"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  type ReactTable,
  type RowData,
} from "@tanstack/react-table";
import { HAIRLINE, INK, INK2, ScrollFade, SPACE, STEP } from "../build/ui";

/** Table features shared by the teacher tables: sorting only. Module scope keeps it stable. */
export const tableFeaturesSorted = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

type Features = typeof tableFeaturesSorted;

const cellStyle = {
  padding: `${SPACE[2]} ${SPACE[3]}`,
  borderBottom: HAIRLINE,
  verticalAlign: "top" as const,
  textAlign: "left" as const,
  fontSize: STEP.s0,
  overflowWrap: "normal" as const,
};

/** Real <table> with <th scope="col">, aria-sort on sortable headers, and a button to toggle each sort. */
export function SortableTable<TData extends RowData>({
  table,
  caption,
  minWidth = "40rem",
}: {
  table: ReactTable<Features, TData>;
  caption: string;
  minWidth?: string;
}) {
  return (
    <ScrollFade tabIndex={0} role="region" aria-label={caption}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth }}>
        <caption style={{ position: "absolute", left: -9999 }}>{caption}</caption>
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => {
                const column = header.column;
                const sorted = column.getCanSort() ? column.getIsSorted() : null;
                const ariaSort = sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : sorted === false ? "none" : undefined;
                return (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={ariaSort}
                    style={{ ...cellStyle, borderBottom: `2px solid ${INK}`, fontWeight: 700, whiteSpace: "nowrap", paddingTop: 0, paddingBottom: 0, verticalAlign: "bottom" }}
                  >
                    {header.isPlaceholder ? null : column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={column.getToggleSortingHandler()}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          minHeight: 40,
                          padding: 0,
                          margin: 0,
                          lineHeight: "inherit",
                          verticalAlign: "bottom",
                          border: "none",
                          background: "transparent",
                          color: INK,
                          font: "inherit",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        <table.FlexRender header={header} />
                        {sorted === "asc" ? (
                          <ArrowUp size={14} aria-hidden />
                        ) : sorted === "desc" ? (
                          <ArrowDown size={14} aria-hidden />
                        ) : (
                          <ChevronsUpDown size={14} aria-hidden style={{ color: INK2 }} />
                        )}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id} style={cellStyle}>
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollFade>
  );
}
