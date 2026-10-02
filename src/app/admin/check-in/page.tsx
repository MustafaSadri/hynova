import { CheckInScanner } from "@/components/admin/check-in-scanner";

export const dynamic = "force-dynamic";

export default async function AdminCheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <div className="min-h-screen bg-neutral-50 px-6 pt-28 pb-10 md:pt-32">
      <CheckInScanner initialToken={token} />
    </div>
  );
}
