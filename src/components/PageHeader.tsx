"use client";

import React, { useEffect, useRef, useState } from "react";
import { UserRound } from "lucide-react";
import s from "./pageHeader.module.css";

type Account = {
  name: string;
  role: string;
  onSignOut: () => void;
  extra?: { label: string; onClick: () => void; icon?: React.ReactNode }[];
};

function AccountMenu({ account }: { account: Account }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <div className={s.account} ref={ref}>
      <button
        type="button"
        className={`btn ${s.accountBtn}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account: ${account.name}`}
        title={account.name}
        onClick={() => setOpen((v) => !v)}
      >
        <UserRound size={18} aria-hidden="true" />
        <span className={s.accountName}>{account.name.length > 24 ? account.name.slice(0, 24) + "…" : account.name}</span>
      </button>
      {open && (
        <div className={s.menu} role="menu">
          <div className={s.who}>
            <strong>{account.name}</strong>
            <span className="meta">{account.role}</span>
          </div>
          {account.extra?.map((item) => (
            <button key={item.label} type="button" role="menuitem" className={s.item} onClick={() => run(item.onClick)}>
              {item.icon}
              {item.label}
            </button>
          ))}
          <button type="button" role="menuitem" className={s.item} onClick={() => run(account.onSignOut)}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  meta,
  actions,
  account,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  account?: Account;
}) {
  return (
    <header className={s.header}>
      <div className={s.row}>
        <h1 className={`page-title ${s.title}`}>{title}</h1>
        {(actions || account) && (
          <div className={s.actions}>
            {actions}
            {account && <AccountMenu account={account} />}
          </div>
        )}
      </div>
      {meta && <div className={`meta ${s.meta}`}>{meta}</div>}
    </header>
  );
}

export default PageHeader;
