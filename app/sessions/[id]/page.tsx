import { getSession } from "@/lib/api";
import { SessionDetail } from "@/components/session-detail";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let session;
  try {
    session = await getSession(id);
  } catch {
    notFound();
  }

  return <SessionDetail session={session} />;
}
