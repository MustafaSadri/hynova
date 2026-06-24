"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";

const products = [
  {
    name: "Retatrutide Injection",
    category: "Injectable Peptide",
    description: "Advanced triple-agonist therapy for optimal metabolic regulation and sustained weight management.",
    imageSrc: "/products/retatrutide-injection.png",
    gradient: "from-purple-500/20 to-purple-800/20",
    border: "group-hover:border-purple-500/50",
    specs: [
      "Mimics GLP-1, GIP, and Glucagon to speed up metabolism.",
      "Proven in trials to support up to 24% weight reduction.",
      "Pre-filled injection pen for simple and precise dosing.",
      "Strongest efficacy in its class with direct fat-burning pathways.",
      "Designed for long-term health and metabolic balance."
    ]
  },
  {
    name: "Retatrutide Powder",
    category: "Lyophilized Peptide",
    description: "High-purity lyophilized formulation designed for extended stability and research applications.",
    imageSrc: "/products/retatrutide-powder.png",
    gradient: "from-indigo-500/20 to-blue-800/20",
    border: "group-hover:border-indigo-500/50",
    specs: [
      "Verified at ≥ 99.9% purity via laboratory HPLC analysis.",
      "Lyophilized (freeze-dried) to maintain peak stability.",
      "Ideal for scientific research, assays, and stability studies.",
      "Reconstitutes quickly and cleanly with bacteriostatic water.",
      "Contains zero additives, stabilizers, or bulk fillers."
    ]
  },
  {
    name: "Tirzepatide Injection",
    category: "Injectable Peptide",
    description: "Dual-targeted GIP and GLP-1 receptor agonist revolutionizing glycemic control.",
    imageSrc: "/products/tirzepatide-injection.png",
    gradient: "from-teal-500/20 to-emerald-800/20",
    border: "group-hover:border-teal-500/50",
    specs: [
      "Mimics GIP and GLP-1 hormones to signal natural fullness.",
      "Slows digestion to prolong satiety and control appetite.",
      "Supports robust glycemic control and metabolic regulation.",
      "Delivered via a convenient once-weekly subcutaneous injection.",
      "Highly documented safety profile in global clinical research."
    ]
  },
  {
    name: "Tirzepatide Powder",
    category: "Lyophilized Peptide",
    description: "Premium grade lyophilized dual-agonist with guaranteed 99.9% purity standards.",
    imageSrc: "/products/tirzepatide-powder.png",
    gradient: "from-emerald-500/20 to-green-800/20",
    border: "group-hover:border-emerald-500/50",
    specs: [
      "Guaranteed ≥ 99.9% purity with detailed HPLC certificate.",
      "Freeze-dried format optimized for maximum long-term shelf life.",
      "Perfect for clinical labs requiring exact compound concentration.",
      "Highly soluble in standard laboratory reconstitution media.",
      "Synthesized under strict quality-controlled conditions."
    ]
  },
  {
    name: "Orforglipron Tablets",
    category: "Oral Non-peptide",
    description: "Next-generation oral GLP-1 receptor agonist for convenient, daily metabolic support.",
    imageSrc: "/products/orforglipron-tablets.png",
    gradient: "from-orange-500/20 to-amber-800/20",
    border: "group-hover:border-orange-500/50",
    specs: [
      "Simple, daily oral tablet format (no needles required).",
      "Directly stimulates GLP-1 receptors to regulate appetite.",
      "Provides premium metabolic support with tablet convenience.",
      "Easy to store and travel with at standard room temperature.",
      "Excellent alternative for needle-sensitive weight management."
    ]
  }
];

export function ProductPortfolio() {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Our Portfolio
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            A curated selection of the world's most advanced metabolic and weight-management solutions, engineered for uncompromising excellence.
          </motion.p>
        </div>

        {/* Mobile: Horizontal Scroll Snap, Desktop: CSS Grid */}
        <div className="flex overflow-x-auto pb-12 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible md:snap-none md:px-0 md:mx-0 hide-scrollbar">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex-none w-[90vw] md:w-auto snap-center mr-4 md:mr-0 last:mr-0 perspective-1000 transition-all duration-500 hover:-translate-y-1"
            >
              <div className={`flip-card-inner ${flippedCards[index] ? 'flipped' : ''}`}>
                
                {/* Front Side */}
                <div className={`card-front flex flex-col rounded-3xl border border-border/50 bg-card overflow-hidden ${product.border} backface-hidden`}>
                  {/* Card Header Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Product Image Container */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(product.imageSrc);
                      }}
                      className="relative w-full aspect-[4/3] bg-white p-6 overflow-hidden cursor-zoom-in"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent mix-blend-multiply z-10 pointer-events-none"></div>
                      <div className="relative w-full h-full transform transition-transform duration-700 group-hover:scale-105">
                        <Image 
                          src={product.imageSrc} 
                          alt={product.name} 
                          fill 
                          className="object-contain drop-shadow-xl"
                          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index < 3}
                        />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
                        {product.category}
                      </h3>
                      <h4 className="text-2xl font-bold text-foreground mb-4">
                        {product.name}
                      </h4>
                      
                      <p className="text-muted-foreground mb-8 flex-grow text-sm leading-relaxed">
                        {product.description}
                      </p>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFlip(index);
                        }}
                        className="flex items-center text-sm font-medium text-foreground mt-auto opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none"
                      >
                        View Specifications <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div className={`card-back flex flex-col rounded-3xl border border-border/50 bg-card overflow-hidden ${product.border} backface-hidden rotate-y-180`}>
                  {/* Card Header Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full p-8">
                    <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
                      Specifications
                    </h3>
                    <h4 className="text-2xl font-bold text-foreground mb-6">
                      {product.name}
                    </h4>
                    
                    <ul className="space-y-4 mb-8 flex-grow">
                      {product.specs.map((spec, sIdx) => (
                        <li key={sIdx} className="flex items-start text-sm text-muted-foreground leading-relaxed text-left">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-3 flex-shrink-0 mt-2"></span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(index);
                      }}
                      className="flex items-center text-sm font-medium text-foreground mt-auto opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      Back to Overview
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .flip-card-inner {
          display: grid;
          grid-template-columns: 100%;
          grid-template-rows: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .card-front, .card-back {
          grid-area: 1 / 1 / 2 / 2;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}} />

      {/* Product Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[85vh] aspect-[4/3] w-full bg-white p-4 rounded-3xl shadow-2xl flex items-center justify-center cursor-default animate-fade-in" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center focus:outline-none transition-colors z-20 cursor-pointer text-lg font-bold"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <div className="relative w-full h-full">
              <Image 
                src={selectedImage} 
                alt="Product Detail" 
                fill 
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
