import { getSession, getSessions } from "@/lib/api";
import { SessionDetail } from "@/components/session-detail";
import { notFound, redirect } from "next/navigation";

export const revalidate = 60;

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let session;
  try {
    session = await getSession(id);
  } catch {
    // if the id looks like a truncated hash, try prefix matching
    if (id.startsWith("0x") && id.length < 66) {
      try {
        const all = await getSessions(200);
        const match = all.find((s) => s.sessionId.startsWith(id));
        if (match) redirect(`/sessions/${match.sessionId}`);
      } catch {}
    }
    notFound();
  }

  return <SessionDetail session={session} />;
}
