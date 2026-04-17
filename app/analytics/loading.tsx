import { Spinner } from "@/components/ui/spinner";

export default function AnalyticsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col items-center justify-center gap-4 min-h-[60vh]">
      <Spinner className="size-6" />
      <p className="text-sm text-muted-foreground">loading analytics...</p>
    </div>
  );
}
