"use client";

import { useState } from "react";
import { MapPin, RefreshCw, Database, Layers, Lock } from "lucide-react";
import {
  LOCATIONS,
  ALL_PRICE_TYPES,
  Location,
  PriceType,
  LOCATION_LABELS,
  PRICE_TYPE_LABELS,
  PRICE_TYPE_EMOJI,
  getLevel2Items,
  getAvailablePriceTypes,
} from "@/data/commodityData";
import { useUser, PremiumFeature } from "@/context/UserContext";
import BICard from "./BICard";
import BIDetailPanel from "./BIDetailPanel";
import SupplyChainPanel from "./SupplyChainPanel";
import PremiumLock from "./PremiumLock";
import TeamManagement from "./TeamManagement";

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState<Location>("nasional");
  const [selectedPriceType, setSelectedPriceType] = useState<PriceType>("produsen");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showMargin, setShowMargin] = useState(false);
  const { isPremiumFeature } = useUser();
  const [lastUpdated] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  });

  const availPT = getAvailablePriceTypes(selectedLocation);
  const currentItems = getLevel2Items(selectedLocation, selectedPriceType);
  const safeIndex = Math.min(selectedIndex, Math.max(0, currentItems.length - 1));

  // When switching location, reset price type if not available
  const handleLocationChange = (loc: Location) => {
    setSelectedLocation(loc);
    setSelectedIndex(0);
    const avail = getAvailablePriceTypes(loc);
    if (!avail.includes(selectedPriceType)) {
      setSelectedPriceType(avail[0] || "produsen");
    }
  };

  return (
    <section id="dashboard" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeamManagement />

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide mb-4">
              <Database className="w-3 h-3" />
              Price Dashboard
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Pantau Harga Komoditas
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-lg leading-relaxed">
              Data harga dari Bank Indonesia PIHPS. Bandingkan harga produsen dengan pasar untuk melihat margin rantai pasok.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <RefreshCw className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs font-medium text-gray-500">Update: {lastUpdated}</span>
          </div>
        </div>

        {/* Location filter */}
        <div className="flex items-center gap-3 mb-4 flex-wrap animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mr-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
            <MapPin className="w-4 h-4 text-green-500" />
            <span className="font-semibold">Wilayah:</span>
          </div>
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocationChange(loc)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                  ${selectedLocation === loc
                    ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                    : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                  }`}
              >
                {loc === "cianjur" ? "📍 " : loc === "jabar" ? "🗺️ " : "🌏 "}
                {LOCATION_LABELS[loc]}
              </button>
            ))}
          </div>

          {/* Source badge */}
          <div className="ml-auto hidden sm:flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-blue-700">Sumber: Bank Indonesia PIHPS</span>
          </div>
        </div>

        {/* Price Type sub-tabs + Margin toggle */}
        <div className="flex items-center gap-3 mb-8 flex-wrap animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mr-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold">Tipe Harga:</span>
          </div>
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100 flex-wrap">
            {ALL_PRICE_TYPES.map((pt) => {
              const isAvailable = availPT.includes(pt);
              return (
                <button
                  key={pt}
                  disabled={!isAvailable}
                  onClick={() => {
                    setSelectedPriceType(pt);
                    setSelectedIndex(0);
                    setShowMargin(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                    ${!isAvailable
                      ? "text-gray-300 cursor-not-allowed"
                      : selectedPriceType === pt && !showMargin
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-gray-600 hover:text-indigo-700 hover:bg-indigo-50"
                    }`}
                >
                  {PRICE_TYPE_EMOJI[pt]} {PRICE_TYPE_LABELS[pt]}
                  {pt !== "produsen" && !isPremiumFeature(pt as PremiumFeature) && (
                    <Lock className="w-3 h-3 inline ml-1 opacity-50" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Margin toggle — only show if location has multiple price types */}
          {availPT.length > 1 && (
            <button
              onClick={() => setShowMargin(!showMargin)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border-2
                ${showMargin
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-lg shadow-amber-500/20"
                  : "bg-white text-amber-700 border-amber-200 hover:border-amber-400 hover:shadow-md"
                }`}
            >
              📊 Margin Rantai Pasok
            </button>
          )}
        </div>

        {/* Content area */}
        {showMargin ? (
          <PremiumLock feature="supply_chain_margin">
            <SupplyChainPanel location={selectedLocation} />
          </PremiumLock>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-sm">Tidak ada data tersedia untuk kombinasi wilayah dan tipe harga ini.</p>
          </div>
        ) : selectedPriceType !== "produsen" && !isPremiumFeature(selectedPriceType as PremiumFeature) ? (
          <PremiumLock feature={selectedPriceType as PremiumFeature} title={`Data ${PRICE_TYPE_LABELS[selectedPriceType]}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {currentItems.map((item, i) => (
                <BICard
                  key={`${item.name}-${selectedLocation}-${selectedPriceType}`}
                  item={item}
                  isSelected={safeIndex === i}
                  onClick={() => {}}
                />
              ))}
            </div>
          </PremiumLock>
        ) : (
          <>
            {/* Commodity cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {currentItems.map((item, i) => (
                <BICard
                  key={`${item.name}-${selectedLocation}-${selectedPriceType}`}
                  item={item}
                  isSelected={safeIndex === i}
                  onClick={() => setSelectedIndex(i)}
                />
              ))}
            </div>

            {/* Detail panel */}
            {currentItems[safeIndex] && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <BIDetailPanel
                  item={currentItems[safeIndex]}
                  location={selectedLocation}
                  priceType={selectedPriceType}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
