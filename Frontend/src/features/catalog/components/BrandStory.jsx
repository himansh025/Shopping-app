import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Star } from 'lucide-react';

const STORY_IMG =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85';
const SECONDARY_ACCENT_IMG =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85';

export function BrandStory() {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white border-y border-slate-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand Story & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Our Story & Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Crafted for distinction. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900">
                Engineered for everyday living.
              </span>
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal max-w-xl">
              We partner directly with verified independent designers, specialized ateliers, and certified tech innovators. By bypassing middlemen markups, we deliver runway aesthetics, durable tailoring, and authentic products directly to your door.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">100% Verified Origin</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Every product undergoes multi-point quality authentication prior to packaging.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Conscious Quality</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Premium sourced textiles and durable components engineered for longevity.
                </p>
              </div>
            </div>

            {/* Action CTA Links */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/men"
                className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2 group active:scale-95"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/electronics"
                className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-300 shadow-xs transition-all"
              >
                Browse Electronics
              </Link>
            </div>
          </div>

          {/* Right Column: Layered Editorial Visuals */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Primary Atelier Showcase Image */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl group">
              <img
                src={STORY_IMG}
                alt="Boutique design atelier"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Bottom Quote Overlay */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg text-slate-800">
                <p className="text-xs italic leading-relaxed text-slate-700">
                  &ldquo;Simplicity is the ultimate sophistication. Every collection is curated to be worn, loved, and kept.&rdquo;
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-900">— Studio Atelier</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-[11px] font-bold text-slate-900">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Small Accent Card */}
            <div className="hidden sm:block absolute -bottom-6 -left-6 w-36 h-44 rounded-2xl overflow-hidden border-4 border-white shadow-xl z-20 group">
              <img
                src={SECONDARY_ACCENT_IMG}
                alt="Curated lookbook portrait"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandStory;
