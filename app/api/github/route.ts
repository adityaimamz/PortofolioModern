import { NextResponse } from "next/server";
import { getGithubData } from "@/services/github";

export const revalidate = 3600;

export async function GET() {
  const { status, data } = await getGithubData();

  if (!data) {
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status }
    );
  }

  return NextResponse.json(data.contributionsCollection.contributionCalendar);
}
