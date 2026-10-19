/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'Autumn / Winter 2026',
    title: 'The Art of Modern Dressing',
    description:
      'Curated silhouettes, refined textures, and effortless tailoring designed for modern distinction.',
    primaryCta: { label: 'Explore Women', path: '/women' },
    secondaryCta: { label: 'Explore Men', path: '/men' },
    badge: 'New Season Edit',
    accentColor: 'from-amber-500/20 to-orange-500/10',
    image:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2400&q=85',
  },
  {
    id: 2,
    tag: 'Urban Culture & Streetwear',
    title: 'Precision Craft & Everyday Edge',
    description:
      'From oversized fleece to relaxed denim and structured outerwear. Engineered for movement and style.',
    primaryCta: { label: 'Shop Menswear', path: '/men' },
    secondaryCta: { label: 'View Collection', path: '/men' },
    badge: 'Trending Now',
    accentColor: 'from-blue-500/20 to-indigo-500/10',
    image:
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=2400&q=85',
  },
  {
    id: 3,
    tag: 'Tech & Lifestyle Showcase',
    title: 'Future-Ready Audio & Gadgets',
    description:
      'Immerse in studio acoustics, noise cancellation, and minimal design designed to elevate your daily routine.',
    primaryCta: { label: 'Shop Electronics', path: '/electronics' },
    secondaryCta: { label: 'Explore Gear', path: '/electronics' },
    badge: 'Up to 40% Off',
    accentColor: 'from-purple-500/20 to-pink-500/10',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=2400&q=85',
  },
];

const TRUST_METRICS = [
  {
    icon: <Truck className="w-5 h-5 text-slate-800" />,
    title: 'Express Delivery',
    subtitle: 'Free shipping on orders over ₹999',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-slate-800" />,
    title: '100% Authentic',
    subtitle: 'Verified brands & direct sellers',
  },
  {
    icon: <RotateCcw className="w-5 h-5 text-slate-800" />,
    title: 'Hassle-Free Returns',
    subtitle: '7-day easy exchange guarantee',
  },
  {
    icon: <Zap className="w-5 h-5 text-slate-800" />,
    title: 'Instant Support',
    subtitle: '24/7 AI-powered assistance',
  },
];

export function HeroSection({ onExploreClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="w-full">
      {/* Main Full-Bleed Banner Hero */}
      <div
        className="relative w-full h-[620px] sm:h-[680px] lg:h-[720px] overflow-hidden bg-slate-950 select-none group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Slide Images with Crossfade */}
        {HERO_SLIDES.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ transitionProperty: 'opacity, transform' }}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover object-center filter brightness-[0.78]"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          </div>
        ))}

        {/* Foreground Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 sm:pb-24">
          <div className="max-w-2xl text-white">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] mb-4 sm:mb-5">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200/90 leading-relaxed font-normal mb-8 max-w-xl">
              {slide.description}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                to={slide.primaryCta.path}
                className="px-7 py-3.5 rounded-full bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] flex items-center gap-2 active:scale-95"
              >
                <span>{slide.primaryCta.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all hover:border-white/40"
              >
                View Featured Items
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators / Progress Bars */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating Modern Trust & Value Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_METRICS.map((metric, i) => (
            <div key={i} className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/70 flex items-center justify-center shrink-0">
                {metric.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {metric.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                  {metric.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
