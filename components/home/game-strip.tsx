const metrics = [
  {
    value: "x12",
    label: "Hot streak",
    description: "Chain correct answers together and keep the rhythm alive.",
  },
  {
    value: "0.8s",
    label: "Fast recall",
    description: "Move from recognition to instinct with repeated exposure.",
  },
  {
    value: "84%",
    label: "Mastery rate",
    description: "Turn category reps into a visible sense of progress.",
  },
  {
    value: "Hard",
    label: "Challenge tier",
    description: "Push into multi-step or platform-specific combos when ready.",
  },
];

export function GameStrip() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[24px] border border-line bg-[linear-gradient(135deg,rgba(37,37,38,0.98),rgba(30,30,30,0.98),rgba(24,24,24,0.98))] p-6 shadow-glow sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#9cdcfe]">
            Game feel
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Streaks, speed, mastery, challenge.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            DevKeys is built to feel alive. The interface rewards momentum and
            keeps the focus on training sessions, not passive reading.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[18px] border border-line bg-[#2d2d30] p-5"
            >
              <p className="text-3xl font-semibold text-white">{metric.value}</p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-[#9cdcfe]">
                {metric.label}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
