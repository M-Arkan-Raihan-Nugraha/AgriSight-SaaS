export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-center">
      {/* Animated logo */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-xl shadow-green-200/50 animate-pulse-glow">
          <img src="/images/logo.jpeg" alt="AgriSight Logo" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -inset-4 rounded-3xl bg-green-400/20 blur-xl animate-pulse" />
      </div>

      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-6" />

      {/* Text */}
      <h2 className="text-green-900 font-bold text-lg mb-1">
        Memuat AgriSight...
      </h2>
      <p className="text-green-600/60 text-sm">
        Mengambil data harga terkini dari Bank Indonesia PIHPS
      </p>

      {/* Decorative dots */}
      <div className="flex items-center gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
