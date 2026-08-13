import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ maxWidth = "max-w-xl" }: { maxWidth?: string }) {
  return (
    <header className="border-b border-neutral-100 bg-white px-6 py-5">
      <div className={cn("mx-auto flex items-center justify-between", maxWidth)}>
        <Link href="/">
          <Image
            src="/logo/cynapept-color.svg"
            alt="Cynapept"
            width={140}
            height={30}
            className="h-6 w-auto"
          />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </div>
    </header>
  );
}
