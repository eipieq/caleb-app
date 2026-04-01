import { getPolicy } from "@/lib/api";
import { StrategyForm } from "@/components/strategy-form";

export const revalidate = 0;

export default async function StrategyPage() {
  let policy = null;
  try {
    policy = await getPolicy();
  } catch {
    // use form defaults
  }

  return <StrategyForm initialPolicy={policy} />;
}
