import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="page-enter"
      style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100%" }}
    >
      {children}
    </div>
  );
}
