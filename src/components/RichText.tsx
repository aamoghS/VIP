import React from "react";

const codeClass = (code: string) => (code.length > 24 ? "code-inline code-inline--long" : "code-inline");

// Conservative auto-detection in prose: `name()` / `name(arg)` and `name = 5` / `name = "x"` / `name = other`.
const AUTO_CODE = /\b[A-Za-z_]\w*\((?:[\w.,'"+\-*\/ ]{0,24})\)|(?<![<>=!\w])\b[A-Za-z_]\w*\s=\s(?:-?\d+(?:\.\d+)?\b|"[^"\n]*"|'[^'\n]*'|[A-Za-z_]\w*\b)(?!\s*[=(])/g;

function autoCode(text: string, keyPrefix: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(AUTO_CODE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(<code key={keyPrefix + at} className={codeClass(m[0])}>{m[0]}</code>);
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`\n]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.length > 2 && part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className={codeClass(part.slice(1, -1))}>{part.slice(1, -1)}</code>
        ) : (
          <React.Fragment key={i}>{autoCode(part, "a" + i + "-")}</React.Fragment>
        ),
      )}
    </>
  );
}

const CODE_LINE = /(^\s{2,}\S)|(^\s*[\w.\[\]"']+\s*[-+*/%]?=\s*\S)|(\w\(.*\))|(:\s*$)|(^\s*(print|while|for|if|elif|else|def|return|import)\b)/;

function looksLikeCode(block: string) {
  const lines = block.split("\n").filter((l) => l.trim());
  return lines.length > 0 && lines.every((l) => CODE_LINE.test(l));
}

export function PromptWithCode({ text }: { text: string }) {
  const parts = text.split(/\n[ \t]*\n/);
  const first = parts.findIndex((p, i) => i > 0 && looksLikeCode(p));
  if (first < 1) return <RichText text={text} />;
  let last = first;
  while (last + 1 < parts.length && looksLikeCode(parts[last + 1])) last++;
  const before = parts.slice(0, first).join("\n\n");
  const after = parts.slice(last + 1).join("\n\n");
  const code = parts.slice(first, last + 1).join("\n\n").replace(/^\n+|\s+$/g, "");
  return (
    <>
      <RichText text={before} />
      <pre className="code-block">{code}</pre>
      {after && <RichText text={after} />}
    </>
  );
}

const BARE_CALL = /\b[A-Za-z_]\w*\([^()]*\)/g;

/** True when the whole option is one code expression, not a sentence that mentions code. */
function isWholeCode(text: string) {
  const prose = text.replace(/`[^`]*`/g, "").replace(BARE_CALL, "");
  const wordRun = /\b[A-Za-z]{2,}\s+[A-Za-z]{2,}\s+[A-Za-z]{2,}\b/.test(prose);
  const t = text.trim();
  if (/^-?\d+(\.\d+)?$/.test(t) || /^(True|False|None)$/.test(t)) return true;
  if (/\s(\+|-|\*|\/|%)=\s/.test(t) && !wordRun) return true;
  const keyword = /^(if|elif|else|while|for|def|return|print|del|import)\b/.test(t);
  if (keyword) {
    const words = (prose.match(/\b[A-Za-z]{2,}\b/g) ?? []).length;
    if (/:\s*$/.test(t) && words <= 4) return true;
    if (/[<>=()\[\]:+\-*\/"']/.test(t) && words <= 4) return true;
  }
  return /[=;{}`]|\w\(.*\)\s*$|^\s*[\w.]+\[/.test(text) && !wordRun;
}

/**
 * Answer option text. A whole code expression renders as one <code>; a sentence renders as prose
 * with only its code fragments in <code>. Mono appears only on <code>.
 */
export function OptionText({ text }: { text: string }) {
  if (isWholeCode(text)) {
    const code = text.replace(/^`|`$/g, "");
    return <code className={codeClass(code)}>{code}</code>;
  }
  const wrapped = text.replace(/(`[^`]+`)|(\b[A-Za-z_]\w*\([^()]*\))/g, (m, ticked) => (ticked ? m : "`" + m + "`"));
  return <RichText text={wrapped} />;
}
