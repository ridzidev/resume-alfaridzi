"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Publications from "@/components/Publications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  useEffect(() => {
    // Track page view
    const trackView = async () => {
      try {
        const response = await fetch('/api/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: '/',
            referrer: document.referrer || null,
            userAgent: navigator.userAgent,
          }),
        });

        if (!response.ok) {
          console.error('Failed to track view');
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackView();
  }, []);

  return (
    <main className="overflow-x-hidden">
      <Sidebar />
      <Hero />
      <About />
      <Projects />
      <Publications />
      <Contact />
      <Footer />
    </main>
  );
}
