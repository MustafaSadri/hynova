import type { Metadata } from "next";
import { Verify } from "@/components/sections/verify";

export const metadata: Metadata = {
  title: "Verify Product | Cynapept",
  description: "Confirm the authenticity of your Cynapept product.",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  return <Verify initialCode={code} />;
}
