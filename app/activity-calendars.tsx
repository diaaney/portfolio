"use client";

import { useEffect, useState } from "react";

type DailyActivity = Record<string, number>;
type ActivityData = { github: DailyActivity | null; leetcode: DailyActivity | null };

const monthFormatter = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });
const dayFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function makeWeeks(today: Date) {
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const start = addDays(end, -89);

  const first = addDays(start, -start.getUTCDay());
  const last = addDays(end, 6 - end.getUTCDay());
  const weeks: Date[][] = [];

  for (let date = first; date <= last; date = addDays(date, 7)) {
    weeks.push(Array.from({ length: 7 }, (_, day) => addDays(date, day)));
  }

  return { weeks, start: dateKey(start), end: dateKey(end) };
}

function activityLevel(count: number, kind: "github" | "leetcode") {
  if (count === 0) return 0;
  if (kind === "github") return count >= 8 ? 4 : count >= 4 ? 3 : count >= 2 ? 2 : 1;
  return count >= 5 ? 4 : count >= 3 ? 3 : count >= 2 ? 2 : 1;
}

function ActivityCard({
  kind,
  days,
  loading,
  weeks,
  start,
  end,
}: {
  kind: "github" | "leetcode";
  days: DailyActivity | null;
  loading: boolean;
  weeks: Date[][];
  start: string;
  end: string;
}) {
  const name = kind === "github" ? "GitHub" : "LeetCode";
  const unit = kind === "github" ? "contributions" : "submissions";
  const href = kind === "github" ? "https://github.com/diaaney" : "https://leetcode.com/u/diaaney/";
  const total = days
    ? Object.entries(days).reduce(
        (sum, [date, count]) => sum + (date >= start && date <= end ? count : 0),
        0,
      )
    : 0;

  return (
    <article className={`activity-card activity-card-${kind}`}>
      <div className="activity-heading">
        <a className="activity-title" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name} profile`}>
          <span className="activity-logo" aria-hidden="true" />
        </a>
        <span className="activity-period">last 3 months</span>
      </div>
      <div className="activity-months" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
        {weeks.map((week, index) => {
          const firstOfMonth = week.find((day) => day.getUTCDate() === 1 && dateKey(day) <= end);
          const label = index === 0
            ? monthFormatter.format(new Date(`${start}T00:00:00Z`))
            : firstOfMonth
              ? monthFormatter.format(firstOfMonth)
              : "";
          return <span key={dateKey(week[0])}>{label}</span>;
        })}
      </div>
      <div
        className="activity-heatmap"
        role="img"
        aria-label={days ? `${total} ${unit} in the last 3 months` : `${name} activity ${loading ? "loading" : "unavailable"}`}
        style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
      >
        {weeks.map((week) => (
          <div className="activity-week" key={dateKey(week[0])}>
            {week.map((day) => {
              const date = dateKey(day);
              const outside = date < start || date > end;
              const count = days?.[date] ?? 0;
              return (
                <span
                  className={`activity-day activity-level-${activityLevel(count, kind)}${outside ? " activity-day-outside" : ""}`}
                  key={date}
                  title={outside ? undefined : `${dayFormatter.format(day)}: ${days ? count : "–"} ${unit}`}
                  aria-hidden="true"
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="activity-footer">
        <span>{days ? `${total} ${unit} in the last 3 months` : loading ? "Loading activity..." : "Activity unavailable"}</span>
        <span className="activity-legend" aria-hidden="true">
          less
          {[0, 1, 2, 3, 4].map((level) => <i className={`activity-level-${level}`} key={level} />)}
          more
        </span>
      </div>
    </article>
  );
}

function ActivitySkeleton({ kind }: { kind: "github" | "leetcode" }) {
  return (
    <article className={`activity-card activity-card-${kind}`} aria-hidden="true">
      <div className="activity-heading">
        <span className="activity-title"><span className="activity-logo" /></span>
        <span className="activity-period">last 3 months</span>
      </div>
      <div className="activity-months" />
      <div className="activity-heatmap" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
        {Array.from({ length: 14 }, (_, week) => (
          <div className="activity-week" key={week}>
            {Array.from({ length: 7 }, (_, day) => <span className="activity-day" key={day} />)}
          </div>
        ))}
      </div>
      <div className="activity-footer">Loading activity...</div>
    </article>
  );
}

export function ActivityCalendars() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    let active = true;
    const frame = requestAnimationFrame(() => { if (active) setToday(new Date()); });

    fetch("/api/activity")
      .then((response) => {
        if (!response.ok) throw new Error("Activity request failed");
        return response.json() as Promise<ActivityData>;
      })
      .then((activity) => { if (active) setData(activity); })
      .catch(() => { if (active) setData({ github: null, leetcode: null }); })
      .finally(() => { if (active) setLoading(false); });

    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!today) {
    return (
      <section className="activity-section" aria-label="Coding activity in the last 3 months">
        <ActivitySkeleton kind="github" />
        <ActivitySkeleton kind="leetcode" />
      </section>
    );
  }

  const { weeks, start, end } = makeWeeks(today);

  return (
    <section className="activity-section" aria-label="Coding activity in the last 3 months">
      <ActivityCard kind="github" days={data?.github ?? null} loading={loading} weeks={weeks} start={start} end={end} />
      <ActivityCard kind="leetcode" days={data?.leetcode ?? null} loading={loading} weeks={weeks} start={start} end={end} />
    </section>
  );
}
