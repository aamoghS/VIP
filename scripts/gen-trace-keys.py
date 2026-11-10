"""Computes the trace-mat answer keys for every story in src/app/build/missions.ts.

    python scripts/gen-trace-keys.py            print the keys
    python scripts/gen-trace-keys.py --write    update the traceKey lines in missions.ts
    python scripts/gen-trace-keys.py --check    exit 1 if missions.ts is out of date

A key cell is a (line, variable) cell where that line assigns the variable, found with the
same rules as traceLayout in src/lib/sprint/trace.ts. Its key is the variable's value right
after each run of the line, in order, joined with ", ". A for header counts only the runs
that bind a new value (not the final check that ends the loop). A line that never runs is "-".
Keys are "<line number>:<variable>", where line 1 is the first non-blank, non-comment line.
"""
import contextlib
import io
import json
import re
import sys
from pathlib import Path

MISSIONS = Path(__file__).resolve().parent.parent / "src" / "app" / "build" / "missions.ts"
INDENT = " " * 10

ASSIGN = re.compile(r"^\s*([A-Za-z_]\w*)\s*(?:\*\*|//|<<|>>|[-+*/%&|^@])?=(?!=)", re.ASCII)
FOR_LOOP = re.compile(r"^\s*for\s+([A-Za-z_]\w*)\s+in\b", re.ASCII)
STEP_LIMIT = 100_000


def layout(code):
    """Rows of the mat: (source line number, variable assigned there or None, is a for header)."""
    rows = []
    for number, raw in enumerate(code.split("\n"), 1):
        line = re.sub(r"#.*$", "", raw).rstrip()
        if not line.strip():
            continue
        match = ASSIGN.match(line) or FOR_LOOP.match(line)
        rows.append((number, match.group(1) if match else None, bool(FOR_LOOP.match(line))))
    return rows


def indent(code_lines, number):
    line = code_lines[number - 1]
    return len(line) - len(line.lstrip())


def run(code):
    """Returns {row: [values after each run of that line]} for every row that assigns a variable."""
    rows = layout(code)
    code_lines = code.split("\n")
    by_number = {number: (index + 1, var, is_for) for index, (number, var, is_for) in enumerate(rows)}
    values = {index + 1: [] for index, (_, var, _) in enumerate(rows) if var}
    state = {"prev": None, "steps": 0}

    def settle(frame, following):
        prev = state["prev"]
        if prev is None:
            return
        row, var, is_for = by_number[prev]
        if not var:
            return
        if is_for and not (following is not None and following > prev and indent(code_lines, following) > indent(code_lines, prev)):
            return
        values[row].append(str(frame.f_globals[var]))

    def tracer(frame, event, _arg):
        if frame.f_code.co_filename != "<story>":
            return None
        state["steps"] += 1
        if state["steps"] > STEP_LIMIT:
            raise RuntimeError("story code did not finish")
        if event == "line":
            settle(frame, frame.f_lineno)
            state["prev"] = frame.f_lineno
        elif event == "return":
            settle(frame, None)
        return tracer

    compiled = compile(code, "<story>", "exec")
    sys.settrace(tracer)
    try:
        with contextlib.redirect_stdout(io.StringIO()):
            exec(compiled, {"__name__": "__story__"})
    finally:
        sys.settrace(None)
    return rows, values


def trace_key(code):
    rows, values = run(code)
    key = {}
    for index, (_, var, _) in enumerate(rows):
        if var:
            key[f"{index + 1}:{var}"] = ", ".join(values[index + 1]) or "-"
    return key


def ts_line(key):
    body = ", ".join(f"{json.dumps(cell)}: {json.dumps(value)}" for cell, value in key.items())
    return f"{INDENT}traceKey: {{ {body} }},"


def process(text):
    """Returns (new text, [(mission, team, title, key)]). Line endings are kept as they are."""
    newline = "\r\n" if "\r\n" in text else "\n"
    out, found = [], []
    mission = team = title = None
    in_questions = False
    skip_old_key = False
    for line in text.split(newline):
        if skip_old_key and line.startswith(f"{INDENT}traceKey:"):
            continue
        skip_old_key = False
        if m := re.match(r'^    id: "(\w+)",$', line):
            mission = m.group(1)
        elif m := re.match(r"^    (groupA|groupB): \{$", line):
            team = m.group(1)[-1]
        elif line == "      questions: [":
            in_questions = True
        elif line == "      ],":
            in_questions = False
        elif in_questions and (m := re.match(rf'^{INDENT}title: (".*"),$', line)):
            title = json.loads(m.group(1))
        elif in_questions and (m := re.match(rf'^{INDENT}code: (".*"),$', line)):
            key = trace_key(json.loads(m.group(1)))
            out.append(line)
            if key:
                out.append(ts_line(key))
                found.append((mission, team, title, key))
            skip_old_key = True
            continue
        out.append(line)
    return newline.join(out), found


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    if mode not in ("", "--write", "--check"):
        sys.exit(__doc__)
    old = MISSIONS.read_bytes().decode("utf-8")
    new, found = process(old)
    if mode == "--write":
        MISSIONS.write_bytes(new.encode("utf-8"))
    elif mode == "--check":
        if new != old:
            sys.exit("missions.ts trace keys are out of date: run python scripts/gen-trace-keys.py --write")
    for mission, team, title, key in found:
        print(f"{mission} team {team}: {title}")
        print(ts_line(key).strip())
    print(f"{len(found)} stories with a trace key")


if __name__ == "__main__":
    main()
