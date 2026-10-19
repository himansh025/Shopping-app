import { useState } from 'react';
import { Mail, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubmitted(true);
    toast.success('Thank you for subscribing to our newsletter!');
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 stroke-[1.5]" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600 mb-2">
          The Atelier List
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
          Receive Curated Drops & Private Offers
        </h2>

        <p className="text-sm sm:text-base text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
          Be the first to discover new arrivals, verified merchant flash sales, and seasonal lookbooks.
          Never spam — only curated essentials.
        </p>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium inline-flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>You&apos;re on the list! Watch your inbox for welcome perks.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>We value your privacy. Unsubscribe anytime with one click.</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default NewsletterSection;
