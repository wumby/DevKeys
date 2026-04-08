type SessionStatsProps = {
  current: number;
  total: number;
  correct: number;
  time: string;
  compact?: boolean;
};

const stats = [
  { key: "Question", accent: "text-[#9cdcfe]" },
  { key: "Correct", accent: "text-lime" },
  { key: "Time", accent: "text-ember" },
] as const;

export function SessionStats({
  current,
  total,
  correct,
  time,
  compact = false,
}: SessionStatsProps) {
  const values = [`${current}/${total}`, `${correct}`, time];

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      {stats.map((stat, index) => (
        <div
          key={stat.key}
          className={`rounded-2xl border border-line bg-panel/95 ${
            compact ? "p-3" : "p-4"
          }`}
        >
          <p
            className={`uppercase tracking-[0.2em] text-muted ${
              compact ? "text-[10px]" : "text-xs"
            }`}
          >
            {stat.key}
          </p>
          <p
            className={`mt-2 font-semibold ${stat.accent} ${
              compact ? "text-xl md:text-2xl" : "text-2xl"
            }`}
          >
            {values[index]}
          </p>
        </div>
      ))}
    </div>
  );
}
