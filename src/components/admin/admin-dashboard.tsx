"use client";

import { useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import {
  REGISTRATION_STATUSES,
  type EventRegistrationRow,
  type RegistrationStatus,
} from "@/lib/rsvp";
import { MAX_PHOTO_BYTES, MAX_VENUE_PHOTOS, type EventDetailsRow } from "@/lib/event-details";

const STATUS_LABELS: Record<RegistrationStatus, string> = {
  registered: "Registered",
  contacting: "Contacting",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<RegistrationStatus, string> = {
  registered: "bg-neutral-100 text-neutral-600",
  contacting: "bg-amber-100 text-amber-700",
  confirmed: "bg-teal-100 text-teal-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

interface Props {
  initialRegistrations: EventRegistrationRow[];
  initialEventDetails: EventDetailsRow | null;
}

export function AdminDashboard({ initialRegistrations, initialEventDetails }: Props) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const [eventName, setEventName] = useState(initialEventDetails?.event_name ?? "");
  const [eventDate, setEventDate] = useState(initialEventDetails?.event_date ?? "");
  const [venueName, setVenueName] = useState(initialEventDetails?.venue_name ?? "");
  const [venueAddress, setVenueAddress] = useState(initialEventDetails?.venue_address ?? "");
  const [venuePhotos, setVenuePhotos] = useState<string[]>(initialEventDetails?.venue_photos ?? []);
  const [savingDetails, setSavingDetails] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const totalAttendees = registrations.reduce((sum, r) => sum + r.guest_count, 0);
  const statusCounts = REGISTRATION_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: registrations.filter((r) => r.status === s).length }),
    {} as Record<RegistrationStatus, number>,
  );

  async function updateStatus(id: number, status: RegistrationStatus) {
    setUpdatingId(id);
    const previous = registrations;
    setRegistrations((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      const res = await fetch(`/api/admin/registrations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setRegistrations(previous); // roll back on failure
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteRegistration(id: number) {
    setDeletingId(id);
    const previous = registrations;
    setRegistrations((rows) => rows.filter((r) => r.id !== id));
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
    } catch {
      setRegistrations(previous); // roll back on failure
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  async function handlePhotoUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setPhotoError(null);

    const remaining = MAX_VENUE_PHOTOS - venuePhotos.length;
    if (remaining <= 0) {
      setPhotoError(`Maximum ${MAX_VENUE_PHOTOS} photos.`);
      return;
    }

    const selected = Array.from(files).slice(0, remaining);
    const tooLarge = selected.find((f) => f.size > MAX_PHOTO_BYTES);
    if (tooLarge) {
      setPhotoError(`"${tooLarge.name}" is too large — max ${Math.round(MAX_PHOTO_BYTES / 1024 / 1024)}MB per photo.`);
      return;
    }

    const dataUrls = await Promise.all(selected.map(fileToDataUrl));
    setVenuePhotos((prev) => [...prev, ...dataUrls]);
  }

  function removePhoto(index: number) {
    setVenuePhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveEventDetails() {
    setSavingDetails(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/event-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          eventDate,
          venueName,
          venueAddress,
          venuePhotos,
        }),
      });
      const data = await res.json();
      setSaveMessage(res.ok && data.ok ? "Saved." : "Failed to save — try again.");
    } catch {
      setSaveMessage("Failed to save — try again.");
    } finally {
      setSavingDetails(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">Event Registrations</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {registrations.length} registration(s) — {totalAttendees} total attendee(s)
          </p>
        </div>
        <a
          href="/admin/rsvps/export"
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Download CSV
        </a>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs tracking-wide text-neutral-400 uppercase">Total</p>
          <p className="mt-1 text-2xl font-medium text-neutral-900">{registrations.length}</p>
        </div>
        {REGISTRATION_STATUSES.map((s) => (
          <div key={s} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-xs tracking-wide text-neutral-400 uppercase">{STATUS_LABELS[s]}</p>
            <p className="mt-1 text-2xl font-medium text-neutral-900">{statusCounts[s]}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-xs tracking-wide text-neutral-400 uppercase">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Guests</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Registered</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-neutral-400">
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
                    <span className="font-medium text-neutral-900">{r.guest_count}</span>
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
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={r.status}
                        disabled={updatingId === r.id}
                        onChange={(e) => updateStatus(r.id, e.target.value as RegistrationStatus)}
                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none ${STATUS_COLORS[r.status]}`}
                      >
                        {REGISTRATION_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      {updatingId === r.id && (
                        <Loader2 className="size-3.5 animate-spin text-neutral-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{formatDate(r.created_at)}</td>
                  <td className="px-5 py-3">
                    {confirmDeleteId === r.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => deleteRegistration(r.id)}
                          disabled={deletingId === r.id}
                          className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {deletingId === r.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            "Confirm"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs text-neutral-500 hover:text-neutral-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(r.id)}
                        aria-label="Delete registration"
                        className="flex size-8 items-center justify-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-medium text-neutral-900">Event Details</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Shown on the public registration page and in the homepage popup.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              Event name
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Cynapept Event Moscow"
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              Date &amp; time
            </label>
            <input
              type="text"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="e.g. 12 December 2026, 7:00 PM"
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              Venue name
            </label>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="e.g. Ritz-Carlton Moscow"
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              Venue address
            </label>
            <input
              type="text"
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              placeholder="e.g. Tverskaya St 3, Moscow"
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            Venue photos ({venuePhotos.length}/{MAX_VENUE_PHOTOS})
          </label>
          <div className="mt-2 flex flex-wrap gap-3">
            {venuePhotos.map((src, i) => (
              <div key={i} className="relative size-24 overflow-hidden rounded-xl border border-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Venue ${i + 1}`} className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label="Remove photo"
                  className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
            {venuePhotos.length < MAX_VENUE_PHOTOS && (
              <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-neutral-300 text-neutral-400 hover:border-teal-400 hover:text-teal-600">
                <Upload className="size-5" />
                <span className="text-xs">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e.target.files)}
                />
              </label>
            )}
          </div>
          {photoError && <p className="mt-2 text-xs text-red-600">{photoError}</p>}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={saveEventDetails}
            disabled={savingDetails}
            className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-2.5 text-sm font-medium text-white hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50"
          >
            {savingDetails ? "Saving…" : "Save Event Details"}
          </button>
          {saveMessage && <p className="text-sm text-neutral-500">{saveMessage}</p>}
        </div>
      </div>
    </div>
  );
}
