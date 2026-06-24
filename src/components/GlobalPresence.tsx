"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

// Conceptual coordinates for a stylized world map
const locations = [
  { name: "North America", top: "30%", left: "20%", active: true },
  { name: "Europe", top: "25%", left: "50%", active: true },
  { name: "Asia", top: "35%", left: "75%", active: true },
  { name: "South America", top: "65%", left: "30%", active: false },
  { name: "Africa", top: "55%", left: "55%", active: false },
  { name: "Australia", top: "75%", left: "85%", active: false }
];

export function GlobalPresence() {
  return (
    <section className="py-24 relative bg-card overflow-hidden border-y border-border/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background/0 to-background/0 opacity-50"></div>
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-primary font-semibold mb-4">Global Reach</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
              Impacting Health <br /> Across Borders
            </h3>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              CYNOVA's strategic international expansion ensures that our cutting-edge metabolic therapies are accessible to those who need them most, regardless of geography.
            </p>
            
            <div className="flex gap-12">
              <div>
                <div className="text-4xl font-bold text-foreground mb-2">12+</div>
                <div className="text-sm text-muted-foreground">Global Offices</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-foreground mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Countries Served</div>
              </div>
            </div>
          </motion.div>

          <div className="relative h-[400px] w-full rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Minimal Map Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-contain" style={{ filter: "invert(1) sepia(1) saturate(5) hue-rotate(175deg)" }}></div>
            
            {locations.map((loc, i) => (
              <motion.div
                key={loc.name}
                className="absolute"
                style={{ top: loc.top, left: loc.left }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="relative group cursor-pointer">
                  <div className={`absolute -inset-4 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity ${loc.active ? 'bg-primary/50' : 'bg-muted-foreground/50'}`}></div>
                  <MapPin className={`w-6 h-6 relative z-10 ${loc.active ? 'text-primary drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'text-muted-foreground'}`} />
                  
                  {loc.active && (
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-primary animate-ping opacity-75"></span>
                  )}
                  
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background border border-border px-3 py-1 rounded-full text-xs font-medium z-20">
                    {loc.name} {loc.active ? "(Active)" : "(Expansion)"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
