type SessionStatsProps = {
  current: number;
  total: number;
  correct: number;
  streak: number;
};

const stats = [
  { key: "Question", accent: "text-[#9cdcfe]" },
  { key: "Correct", accent: "text-lime" },
  { key: "Streak", accent: "text-ember" },
] as const;

export function SessionStats({
  current,
  total,
  correct,
  streak,
}: SessionStatsProps) {
  const values = [`${current}/${total}`, `${correct}`, `${streak}`];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <div
          key={stat.key}
          className="rounded-2xl border border-line bg-panel/95 p-4"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {stat.key}
          </p>
          <p className={`mt-2 text-2xl font-semibold ${stat.accent}`}>
            {values[index]}
          </p>
        </div>
      ))}
    </div>
  );
}
