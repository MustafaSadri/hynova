"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FlaskConical, Globe2, Handshake, Truck } from "lucide-react";

const features = [
  {
    title: "Premium Quality",
    description: "Rigorous multi-stage quality control ensuring absolute purity and consistency.",
    icon: <CheckCircle2 className="w-8 h-8" />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/50"
  },
  {
    title: "Scientific Innovation",
    description: "Relentless R&D driving the next generation of metabolic therapies.",
    icon: <FlaskConical className="w-8 h-8" />,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "group-hover:border-cyan-500/50"
  },
  {
    title: "Reliable Supply",
    description: "Robust global supply chain engineered for uninterrupted availability.",
    icon: <Truck className="w-8 h-8" />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/50"
  },
  {
    title: "Global Vision",
    description: "Expanding our reach to deliver metabolic health solutions worldwide.",
    icon: <Globe2 className="w-8 h-8" />,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "group-hover:border-purple-500/50"
  },
  {
    title: "Professional Partnerships",
    description: "Collaborating with leading researchers and institutions globally.",
    icon: <Handshake className="w-8 h-8" />,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "group-hover:border-pink-500/50"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background/0 to-background/0 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-widest text-primary font-semibold mb-4"
          >
            Why Choose Us
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
          >
            The CYNOVA Advantage
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative p-8 rounded-3xl bg-card border border-border/50 transition-all duration-500 hover:-translate-y-2 ${feature.border} overflow-hidden`}
            >
              {/* Glowing hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 border border-primary/10`}>
                <div className={feature.color}>{feature.icon}</div>
              </div>
              
              <h4 className="text-2xl font-bold text-foreground mb-4 relative z-10">{feature.title}</h4>
              <p className="text-muted-foreground relative z-10">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
