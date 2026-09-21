export const EVENT_DETAILS_TABLE = "event_details";
export const MAX_VENUE_PHOTOS = 6;
export const MAX_PHOTO_BYTES = 3 * 1024 * 1024; // 3MB per photo, base64-in-DB is fine at this scale

export interface EventDetailsRow {
  event_slug: string;
  event_name: string | null;
  event_date: string | null;
  venue_name: string | null;
  venue_address: string | null;
  venue_photos: string[]; // data: URLs
  updated_at: string;
}
