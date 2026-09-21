import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG, type EventRegistrationRow } from "@/lib/rsvp";
import type { EventDetailsRow } from "@/lib/event-details";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";

async function getRegistrations(): Promise<EventRegistrationRow[]> {
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT * FROM event_registrations
      WHERE event_slug = ${CURRENT_EVENT_SLUG}
      ORDER BY created_at DESC
    `) as EventRegistrationRow[];
    return rows;
  } catch {
    // Table may not exist yet if no one has registered — treat as empty
    // rather than erroring the whole admin page.
    return [];
  }
}

async function getEventDetails(): Promise<EventDetailsRow | null> {
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT * FROM event_details WHERE event_slug = ${CURRENT_EVENT_SLUG}
    `) as EventDetailsRow[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function AdminRsvpsPage() {
  const [registrations, eventDetails] = await Promise.all([
    getRegistrations(),
    getEventDetails(),
  ]);

  return (
    <div className="min-h-screen bg-neutral-50 px-6 pt-28 pb-10 md:pt-32">
      <AdminDashboard initialRegistrations={registrations} initialEventDetails={eventDetails} />
    </div>
  );
}
