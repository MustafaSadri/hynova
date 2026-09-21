import { getSql } from "@/lib/db";
import { CURRENT_EVENT_SLUG, type EventRegistrationRow } from "@/lib/rsvp";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminRsvpsPage() {
  const registrations = await getRegistrations();
  const totalAttendees = registrations.reduce((sum, r) => sum + r.guest_count, 0);

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-neutral-900">
              Event Registrations
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {registrations.length} registration(s) — {totalAttendees} total attendee(s) —
              event: {CURRENT_EVENT_SLUG}
            </p>
          </div>
          <a
            href="/admin/rsvps/export"
            className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Download CSV
          </a>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs tracking-wide text-neutral-400 uppercase">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Guests</th>
                <th className="px-5 py-3 font-medium">Registered</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-neutral-400">
                    No registrations yet.
                  </td>
                </tr>
              ) : (
                registrations.map((r) => (
                  <tr key={r.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-5 py-3 text-neutral-900">{r.full_name}</td>
                    <td className="px-5 py-3 text-neutral-600">{r.email}</td>
                    <td className="px-5 py-3 text-neutral-600">{r.phone}</td>
                    <td className="px-5 py-3 text-neutral-600">
                      <span className="font-medium text-neutral-900">
                        {r.guest_count}
                      </span>
                      {r.guests.length > 0 && (
                        <ul className="mt-1 text-xs text-neutral-500">
                          {r.guests.map((g, i) => (
                            <li key={i}>
                              {g.name} — {g.phone}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">
                      {formatDate(r.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
