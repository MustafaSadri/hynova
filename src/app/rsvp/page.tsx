import type { Metadata } from "next";
import { Rsvp } from "@/components/sections/rsvp";

export const metadata: Metadata = {
  title: "Private Event Registration | Cynapept",
  description: "Register for the Cynapept private event.",
};

export default function RsvpPage() {
  return <Rsvp />;
}
