import { Link } from 'react-router-dom';
import { Award, CheckCircle2, Feather, ArrowRight } from 'lucide-react';

const STORY_IMG =
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=80';

export function BrandStory() {
  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-400">
              <Feather className="w-3.5 h-3.5" />
              <span>Our Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Designed with intention. <br className="hidden sm:inline" />
              Made to be lived in.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We partner directly with verified independent makers, ateliers, and verified tech brands.
              By cutting out middlemen markups, we deliver luxury aesthetics, durable tailoring, and
              certified genuine components directly to your doorstep.
            </p>

            {/* Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white">100% Verified Origin</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Strict quality and authenticity inspection on every SKU.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Ethical Craftsmanship</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Responsibly sourced materials built for longevity.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/electronics"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Discover our tech & lifestyle essentials</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="relative">
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={STORY_IMG}
                alt="Portrait from the design atelier"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs text-slate-200">
                <p className="italic">
                  &ldquo;Simplicity is the ultimate sophistication. Every collection is curated to be worn, loved, and kept.&rdquo;
                </p>
                <p className="font-semibold text-white mt-2">— Studio Atelier Collective</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandStory;
