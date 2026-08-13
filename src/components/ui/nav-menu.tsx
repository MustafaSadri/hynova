"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { motion, MotionConfig } from "framer-motion";
import { cn } from "@/lib/utils";

export type IMenu = {
  id: number;
  title: string;
  url: string;
  dropdown?: boolean;
  items?: IMenu[];
  onClick?: (e: MouseEvent) => void;
};

type MenuProps = {
  list: IMenu[];
  variant?: "light" | "dark";
};

export function Menu({ list, variant = "dark" }: MenuProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const isLight = variant === "light";

  return (
    <MotionConfig transition={{ bounce: 0, type: "tween" }}>
      <nav className="relative">
        <ul className="flex items-center">
          {list?.map((item) => {
            return (
              <li key={item.id} className="relative">
                <Link
                  className={cn(
                    "relative flex items-center justify-center rounded px-5 py-2 text-sm font-medium transition-colors",
                    isLight
                      ? "text-white/85 hover:text-white"
                      : "text-neutral-600 hover:text-neutral-900",
                  )}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={item.onClick}
                  href={item.url}
                >
                  {item.title}
                </Link>
                {hovered === item.id && !item.dropdown && (
                  <motion.div
                    layout
                    layoutId="nav-menu-cursor"
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full",
                      isLight ? "bg-white" : "bg-neutral-900",
                    )}
                  />
                )}
                {item.dropdown && hovered === item.id && (
                  <div
                    className="absolute left-0 top-full"
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <motion.div
                      layout
                      transition={{ bounce: 0 }}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      className="mt-3 flex w-56 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
                    >
                      {item.items?.map((nav) => {
                        return (
                          <a
                            key={`link-${nav.id}`}
                            href={nav.url}
                            className="w-full px-4 py-3 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                          >
                            {nav.title}
                          </a>
                        );
                      })}
                    </motion.div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionConfig>
  );
}
