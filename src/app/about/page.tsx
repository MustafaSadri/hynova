import type { Metadata } from "next";
import { About } from "@/components/sections/about";

export const metadata: Metadata = {
  title: "About Us | Cynapept",
  description:
    "Cynapept is a UAE-based pharmaceutical innovator uniting Swiss precision engineering with cutting-edge American technology.",
};

export default function AboutPage() {
  return <About />;
}
