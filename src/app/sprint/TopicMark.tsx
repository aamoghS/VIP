import { Bug, Code2, GitBranch, Repeat2 } from "lucide-react";

const icons = {
  variables: Code2,
  logic: GitBranch,
  loops: Repeat2,
  debugging: Bug,
};

export function TopicMark({ topicKey, size = 22 }: { topicKey: string; size?: number }) {
  const Icon = icons[topicKey as keyof typeof icons] ?? Code2;
  const box = size + 18;
  return (
    <span
      style={{
        width: box,
        height: box,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ticket)",
        border: "3px solid var(--ink)",
        flexShrink: 0,
      }}
    >
      <Icon size={size} color="var(--ink)" />
    </span>
  );
}
