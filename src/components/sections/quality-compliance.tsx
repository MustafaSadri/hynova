import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Microscope,
  Snowflake,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

const steps = [
  {
    icon: BadgeCheck,
    title: "GMP-Certified Manufacturing",
    body: "Every Cynapept product is manufactured in GMP-certified facilities, adhering to the strictest international pharmaceutical standards across all production stages.",
  },
  {
    icon: Snowflake,
    title: "Cold Chain Integrity",
    body: "Our dedicated cold-chain logistics ensure temperature-sensitive peptides maintain full potency and stability from production through final delivery.",
  },
  {
    icon: Microscope,
    title: "Multi-Stage Quality Assurance",
    body: "Each batch undergoes comprehensive HPLC analysis, sterility testing, and independent third-party verification to guarantee ≥99.9% purity.",
  },
  {
    icon: TrendingUp,
    title: "Scalable Production Capacity",
    body: "Our infrastructure is engineered for global-scale output, ensuring consistent availability and rapid response to growing international demand.",
  },
];

export function QualityCompliance() {
  return (
    <>
      <PageHeader maxWidth="max-w-4xl" />

      <section className="relative bg-white px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm tracking-wide text-neutral-500">
            Manufacturing Excellence
          </span>
          <h1 className="mt-5 text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl">
            Built on Precision,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-neutral-900 to-cyan-600">
              Delivered with Integrity.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500">
            Every formulation we ship is manufactured and verified to the
            same rigorous standard, from raw material to final delivery.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="rounded-2xl border border-neutral-200 p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
                    <step.icon className="size-5 text-teal-600" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-xs text-neutral-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-4 font-medium text-neutral-900">{step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-medium text-neutral-900">
                Every batch is uniquely coded and verifiable.
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Confirm the authenticity of your product in seconds.
              </p>
            </div>
            <Link
              href="/verify"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 shrink-0 rounded-full border-0 bg-gradient-to-r from-teal-500 to-cyan-500 px-6 text-white shadow-[0_8px_20px_rgba(13,148,136,0.25)] hover:from-teal-400 hover:to-cyan-400",
              )}
            >
              Verify Product
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
