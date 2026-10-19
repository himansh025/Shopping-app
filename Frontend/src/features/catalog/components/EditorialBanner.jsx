import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

const BANNER_IMG =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=80';

export function EditorialBanner() {
  return (
    <section className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-end text-white overflow-hidden my-12 sm:my-16">
      {/* Background Image with Dark Vignette */}
      <img
        src={BANNER_IMG}
        alt="Street campaign for everyday dressing"
        className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 hover:scale-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-950/20" />

      {/* Editorial Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 w-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Editorial Selection</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4 drop-shadow-sm">
            The art of everyday dressing.
          </h2>

          <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
            Thoughtfully engineered silhouettes, refined textures, and timeless aesthetics.
            Crafted for modern living with uncompromised quality.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/women"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-all hover:gap-3"
            >
              <span>Explore Women&apos;s Line</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/men"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md rounded-xl transition-all"
            >
              <span>Explore Men&apos;s Line</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditorialBanner;
