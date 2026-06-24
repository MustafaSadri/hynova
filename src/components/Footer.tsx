"use client";

import { Globe } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center mb-6">
              <span className="flex h-3 w-3 rounded-full bg-primary mr-3 shadow-[0_0_10px_rgba(8,145,178,0.5)]"></span>
              <span className="text-xl font-bold tracking-widest text-foreground">CYNOVA.LIFE</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Advancing the future of metabolic health through uncompromising scientific innovation and premium quality peptides.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Innovation & Science</a></li>
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Quality Assurance</a></li>
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Global Presence</a></li>
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Portfolio */}
          <div>
            <h4 className="text-foreground font-semibold mb-6">Portfolio</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Retatrutide Injection</a></li>
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Retatrutide Powder</a></li>
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Tirzepatide Injection</a></li>
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Tirzepatide Powder</a></li>
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Orforglipron Tablets</a></li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h4 className="text-foreground font-semibold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">Compliance</a></li>
            </ul>
            
            <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-primary">Disclaimer:</span> Information provided is for educational purposes. Products are intended for qualified professionals.
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CYNOVA.LIFE. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-muted-foreground flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
