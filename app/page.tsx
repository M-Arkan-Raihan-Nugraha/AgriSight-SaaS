"use client";

import Hero from "@/components/Hero";
import MarketTicker from "@/components/MarketTicker";
import Dashboard from "@/components/Dashboard";
import RecommendationSection from "@/components/RecommendationSection";
import AlertsSection from "@/components/AlertsSection";
import AboutSection from "@/components/AboutSection";

export default function HomePage() {
  return (
    <>
      <div className="pt-16">
        <MarketTicker />
      </div>
      <Hero />
      <Dashboard />
      <RecommendationSection />
      <AlertsSection isPanel={false} />
      <AboutSection />
    </>
  );
}
