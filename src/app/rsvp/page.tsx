import type { Metadata } from "next";
import { Rsvp } from "@/components/sections/rsvp";
import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG } from "@/lib/rsvp";
import type { EventDetailsRow } from "@/lib/event-details";

export const metadata: Metadata = {
  title: "Private Event Registration | Cynapept",
  description: "Register for the Cynapept private event.",
};

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
