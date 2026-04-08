import { getPortfolio, getSessions } from "@/lib/api";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function AnalyticsPage() {
  let portfolio;
  try {
    portfolio = await getPortfolio();
  } catch {
    notFound();
  }

  const sessions = await getSessions(200).catch(() => []);

  return <AnalyticsDashboard portfolio={portfolio} sessions={sessions} />;
}
