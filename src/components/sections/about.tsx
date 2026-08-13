import {
  Award,
  Building2,
  FlaskConical,
  Globe2,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

const stats = [
  { value: "UAE", label: "Headquarters & Strategic Hub" },
  { value: "3+", label: "Premium Products Available" },
  { value: "99.9%", label: "Purity Guarantee Per Batch" },
  { value: "GMP", label: "Certified Manufacturing" },
];

const mission = [
  {
    icon: FlaskConical,
    title: "Scientific Innovation",
    body: "Pushing the boundaries of metabolic medicine with cutting-edge research.",
  },
  {
    icon: ShieldCheck,
    title: "Premium Quality Standards",
    body: "Rigorous quality controls and GMP certified production.",
  },
  {
    icon: Building2,
    title: "Global Manufacturing Excellence",
    body: "Advanced facilities designed for scale and temperature-sensitive integrity.",
  },
  {
    icon: HeartHandshake,
    title: "Patient-Centric Approach",
    body: "Delivering therapies optimized for compliance and premium patient experiences.",
  },
];

const advantages = [
  {
    title: "UAE Strategic Hub",
    body: "Headquartered in the UAE — at the crossroads of global trade routes, providing unparalleled access to international markets.",
  },
  {
    title: "Swiss Expertise",
    body: "Precision engineering and pharmaceutical heritage from Swiss manufacturing standards applied to every product we produce.",
  },
  {
    title: "American Technology",
    body: "Cutting-edge US research and development — from advanced synthesis to state-of-the-art quality control systems.",
  },
  {
    title: "GMP Quality Standards",
    body: "Full adherence to international Good Manufacturing Practice standards, ensuring product safety and regulatory compliance.",
  },
  {
    title: "Premium Approach",
    body: "Modern pharmaceutical design focused on patient convenience, compliance, and optimal therapeutic outcomes.",
  },
  {
    title: "Global Partnerships",
    body: "An expansive and growing network of international medical partners, distributors, and research institutions.",
  },
];

export function About() {
  return (
    <>
      <PageHeader maxWidth="max-w-4xl" />

      <section className="relative bg-white px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm tracking-wide text-neutral-500">
            Who We Are
          </span>
          <h1 className="mt-5 text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl">
            UAE-Based Pharmaceutical Innovator,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-neutral-900 to-cyan-600">
              Redefining Global Standards.
            </span>
          </h1>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-neutral-500">
            <p>
              Cynapept is a UAE-based pharmaceutical leader that unites Swiss
              precision engineering with cutting-edge American technology to
              deliver next-generation metabolic health solutions.
            </p>
            <p>
              Our objective is clear: to become one of the world&apos;s most
              trusted innovators in obesity medicine — setting the benchmark
              for efficacy, safety, and patient outcomes across the globe.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-6 border-y border-neutral-100 py-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-medium text-neutral-900 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
              Our Vision
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
              To become one of the world&apos;s most trusted pharmaceutical
              innovators in metabolic health, setting the benchmark for
              efficacy and safety.
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
              Our Mission
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {mission.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50">
                    <item.icon className="size-5 text-teal-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <span className="inline-flex items-center gap-1.5 text-sm tracking-wide text-neutral-500">
              <Award className="size-4 text-teal-600" />
              Why Choose Cynapept
            </span>
            <h2 className="mt-3 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
              The Cynapept Advantage
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
              {advantages.map((item) => (
                <div key={item.title}>
                  <p className="font-medium text-neutral-900">{item.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-5">
            <Globe2 className="size-5 shrink-0 text-teal-600" />
            <p className="text-sm text-neutral-600">
              Dubai, United Arab Emirates — expanding across the Middle East,
              Europe, and Asia.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
