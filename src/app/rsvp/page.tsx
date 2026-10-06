import type { Metadata } from "next";
import { Rsvp } from "@/components/sections/rsvp";
import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG } from "@/lib/rsvp";
import type { EventDetailsRow } from "@/lib/event-details";

export const metadata: Metadata = {
  title: "Private Event Registration | Cynapept",
  description: "Register for the Cynapept private event.",
};

// Without this, Next.js has no signal that this page depends on live data
// (the DB query below isn't a `fetch` call it can see) and prerenders it
// once at build time — so admin edits to event details (venue, date, etc.)
// never show up here until the next deploy. Forcing dynamic rendering
// makes it re-query on every request instead.
export const dynamic = "force-dynamic";

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

export default async function RsvpPage() {
  const eventDetails = await getEventDetails();
  return <Rsvp eventDetails={eventDetails} />;
}
