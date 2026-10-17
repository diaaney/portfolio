import { activityDateKey } from "@/app/activity-date";

type DailyActivity = Record<string, number>;

async function githubActivity(): Promise<DailyActivity> {
  const response = await fetch("https://github.com/users/diaaney/contributions", {
    headers: { Accept: "text/html", "User-Agent": "Diane-Portfolio" },
    next: { revalidate: 300 },
  });

  if (!response.ok) throw new Error("GitHub activity is unavailable");

  const html = await response.text();
  const days: DailyActivity = {};
  const cells = html.matchAll(
    /<td\b[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="\d"[^>]*><\/td>\s*<tool-tip\b[^>]*>([^<]*)<\/tool-tip>/g,
  );

  for (const [, date, tooltip] of cells) {
    const count = tooltip.match(/^([\d,]+) contributions?\b/);
    days[date] = count ? Number(count[1].replaceAll(",", "")) : 0;
  }

  if (Object.keys(days).length < 90) throw new Error("GitHub calendar could not be read");
  return days;
}

async function leetcodeActivity(): Promise<DailyActivity> {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: "https://leetcode.com/" },
    body: JSON.stringify({
      query:
        "query userProfileCalendar($username: String!) { matchedUser(username: $username) { submissionCalendar } recentSubmissionList(username: $username, limit: 100) { timestamp } }",
      variables: { username: "diaaney" },
    }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("LeetCode activity is unavailable");

  const data = (await response.json()) as {
    data?: {
      matchedUser?: { submissionCalendar?: string };
      recentSubmissionList?: { timestamp: string }[];
    };
  };
  const calendar = data.data?.matchedUser?.submissionCalendar;
  if (!calendar) throw new Error("LeetCode calendar could not be read");

  const timestamps = JSON.parse(calendar) as Record<string, number>;
  const days: DailyActivity = {};

  for (const [timestamp, count] of Object.entries(timestamps)) {
    const date = new Date(Number(timestamp) * 1000).toISOString().slice(0, 10);
    days[date] = count;
  }

  // LeetCode groups calendar entries by UTC day. Move recent submissions to
  // the day they happened in Diane's time zone without losing older counts.
  for (const submission of data.data?.recentSubmissionList ?? []) {
    const submittedAt = new Date(Number(submission.timestamp) * 1000);
    if (Number.isNaN(submittedAt.getTime())) continue;
    const utcDate = submittedAt.toISOString().slice(0, 10);
    const localDate = activityDateKey(submittedAt);
    if (utcDate === localDate || !days[utcDate]) continue;
    days[utcDate] -= 1;
    days[localDate] = (days[localDate] ?? 0) + 1;
  }

  return days;
}

export async function GET() {
  const [github, leetcode] = await Promise.allSettled([
    githubActivity(),
    leetcodeActivity(),
  ]);

  return Response.json(
    {
      github: github.status === "fulfilled" ? github.value : null,
      leetcode: leetcode.status === "fulfilled" ? leetcode.value : null,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
