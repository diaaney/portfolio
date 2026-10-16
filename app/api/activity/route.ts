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
        "query userProfileCalendar($username: String!) { matchedUser(username: $username) { submissionCalendar } }",
      variables: { username: "diaaney" },
    }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) throw new Error("LeetCode activity is unavailable");

  const data = (await response.json()) as {
    data?: { matchedUser?: { submissionCalendar?: string } };
  };
  const calendar = data.data?.matchedUser?.submissionCalendar;
  if (!calendar) throw new Error("LeetCode calendar could not be read");

  const timestamps = JSON.parse(calendar) as Record<string, number>;
  const days: DailyActivity = {};

  for (const [timestamp, count] of Object.entries(timestamps)) {
    const date = new Date(Number(timestamp) * 1000).toISOString().slice(0, 10);
    days[date] = count;
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
        "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
}
