import type { Metadata } from "next";
import { PreBook } from "@/components/sections/prebook";

export const metadata: Metadata = {
  title: "Pre-Book | Cynapept",
  description: "Pre-booking is coming soon to Cynapept.",
};

export default function PreBookPage() {
  return <PreBook />;
}
