import type { Metadata } from "next";
import { QualityCompliance } from "@/components/sections/quality-compliance";

export const metadata: Metadata = {
  title: "Quality & Compliance | Cynapept",
  description:
    "GMP-certified manufacturing, cold-chain integrity, and multi-stage quality assurance behind every Cynapept batch.",
};

export default function QualityCompliancePage() {
  return <QualityCompliance />;
}
