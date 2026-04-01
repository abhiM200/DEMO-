import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";

const testimonials = [
  {
    name: "Abhishek Sharma",
    role: "Software Engineer at TCS",
    text: "OutSpark completely transformed my LinkedIn profile! Within a week of the review, I started getting DMs from recruiters at top MNCs. The expert feedback was incredibly detailed and actionable.",
    stars: 5,
    avatar: "AS",
    color: "bg-blue-500",
  },
  {
    name: "Priyanshu Verma",
    role: "Product Manager at Infosys",
    text: "I was skeptical at first, but the review was worth every rupee. They showed me exactly what keywords I was missing and how to rewrite my headline. Profile views tripled in 10 days!",
    stars: 5,
    avatar: "PV",
    color: "bg-purple-500",
  },
  {
    name: "Altamash Khan",
    role: "Data Analyst at Wipro",
    text: "The team at OutSpark really understands what recruiters are looking for. My connection requests doubled and I landed two interview calls the very next week after their review. Highly recommend!",
    stars: 5,
    avatar: "AK",
    color: "bg-green-500",
  },
];

const features = [
  {
    icon: "🔍",
    title: "Deep Profile Analysis",
    desc: "Our experts thoroughly analyze every section of your LinkedIn profile — headline, about, experience, skills, and recommendations.",
  },
  {
    icon: "📈",
    title: "SEO Optimization",
    desc: "We identify the exact keywords recruiters search for in your industry and optimize your profile to rank higher.",
  },
  {
    icon: "✍️",
    title: "Personalized Feedback",
    desc: "You get a detailed, section-by-section review written by a dedicated career expert — not a generic AI report.",
  },
  {
    icon: "🎯",
    title: "Recruiter-Ready Profile",
    desc: "After implementing our suggestions, your profile will attract the right opportunities and stand out in any inbox.",
  },
  {
    icon: "⚡",
    title: "Fast Turnaround",
    desc: "Receive your complete profile review within 2–4 working days. No long waits, no chasing us down.",
  },
  {
    icon: "🔒",
    title: "100% Confidential",
    desc: "We only use your public LinkedIn URL. No login credentials required — your data is always safe with us.",
  },
];

const steps = [
  { num: "01", title: "Share Your LinkedIn URL", desc: "Just paste your LinkedIn profile link. No login needed." },
  { num: "02", title: "Expert Assigns to Your Profile", desc: "A dedicated career expert studies your profile in detail." },
  { num: "03", title: "Detailed Review Delivered", desc: "Receive section-by-section feedback within 2–4 working days." },
  { num: "04", title: "Implement & Get Noticed", desc: "Apply the suggestions and watch your profile views soar." },
];

const faqs = [
  {
    q: "Do you need my LinkedIn login credentials?",
    a: "Absolutely not. We only need your public LinkedIn profile URL. No passwords or personal logins are ever required.",
  },
  {
    q: "How long does the review take?",
    a: "Your complete LinkedIn profile review is delivered within 2–4 working days after you submit your profile link.",
  },
  {
    q: "Who reviews my profile?",
    a: "A dedicated human career expert — not a bot — reviews your profile. They have deep knowledge of hiring trends and recruiter behavior.",
  },
  {
    q: "Can you guarantee interview calls?",
    a: "We optimize your profile for maximum visibility and recruiter engagement. While we can't guarantee interviews, our clients see a significant spike in profile views and connection requests.",
  },
  {
    q: "What if I'm not satisfied with the review?",
    a: "We stand behind our work. If you feel the review didn't meet expectations, reach out to us and we'll make it right.",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>LinkedIn Profile Review — OutSpark</title>
        <meta name="description" content="Get a professional LinkedIn profile review from OutSpark experts. Boost recruiter visibility, optimize keywords, and land more interviews." />
      </Head>

      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-yellow-400 text-yellow-900 text-xs font-semibold px-4 py-1 rounded-full mb-6 uppercase tracking-wide">
            🏆 Backed by The Times of India Group
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Get Your LinkedIn Profile<br />
            <span className="text-yellow-300">Reviewed by Experts</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Stop getting ignored by recruiters. Our career experts analyze your entire LinkedIn profile and tell you exactly what to fix — so you start getting noticed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all"
            >
              Get My Free Profile Review →
            </Link>
            <Link
              href="#how-it-works"
              className="border-2 border-white text-white font-semibold text-lg px-8 py-4 rounded-xl hover:bg-white hover:text-blue-700 transition-all"
            >
              See How It Works
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12 text-blue-200 text-sm">
            <span>⭐ Rated 4.8/5</span>
            <span>👥 1,00,000+ Professionals</span>
            <span>✅ 100% Confidential</span>
          </div>
        </div>
      </section>

      {/* ─── Social Proof Bar ─────────────────────────────────────────────── */}
      <section className="bg-gray-900 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 text-gray-300 text-sm font-medium">
          {["TCS", "Infosys", "Wipro", "HCL", "Accenture", "IBM", "Amazon", "Deloitte"].map((c) => (
            <span key={c} className="opacity-70 hover:opacity-100 transition-opacity">{c}</span>
          ))}
        </div>
        <p className="text-center text-gray-500 text-xs mt-3">Professionals from these companies have used OutSpark</p>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Your LinkedIn Profile Needs
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              A comprehensive review that covers every aspect of your professional presence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg">Simple. Fast. Effective.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 bg-blue-600 text-white text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {s.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -translate-y-1/2 z-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Results. Real People.
            </h2>
            <p className="text-gray-500 text-lg">Here's what professionals are saying after their OutSpark review.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            One Plan. Everything Included.
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            No upsells. No hidden charges. Just a complete, expert LinkedIn review.
          </p>
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">LinkedIn Profile Review</h3>
            <p className="text-gray-400 text-sm mb-6">Complete expert analysis + actionable feedback</p>
            <div className="flex items-end justify-center gap-2 mb-6">
              <span className="text-gray-400 line-through text-2xl">₹1,999</span>
              <span className="text-5xl font-extrabold text-blue-600">₹999</span>
              <span className="text-gray-400 text-sm mb-2">one-time</span>
            </div>
            <ul className="text-left space-y-3 mb-8">
              {[
                "Full profile audit — headline, about, experience, skills",
                "Keyword gap analysis for your industry",
                "Personalized section-by-section feedback",
                "Recruiter visibility score",
                "Delivered in 2–4 working days",
                "One free revision round",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl transition-all text-center shadow-md"
            >
              Get My LinkedIn Review Now →
            </Link>
            <p className="text-gray-400 text-xs mt-4">🔒 Secure checkout · 100% confidential · No login credentials needed</p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-5 group">
                <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-blue-700 py-16 px-4 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your LinkedIn?</h2>
        <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
          Join 1,00,000+ professionals who used OutSpark to get noticed by the right people.
        </p>
        <Link
          href="/register"
          className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-10 py-4 rounded-xl shadow-lg transition-all"
        >
          Start My Profile Review Today →
        </Link>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">OS</span>
              </div>
              <span className="font-bold text-white text-lg">OutSpark</span>
            </div>
            <p className="text-xs">Backed by The Times of India Group</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/login" className="hover:text-white">Login</Link>
            <Link href="/register" className="hover:text-white">Register</Link>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#how-it-works" className="hover:text-white">How It Works</a>
          </div>
        </div>
        <div className="text-center text-xs mt-8 text-gray-600">
          <p>© 2025 OutSpark. All rights reserved. LinkedIn™ is a trademark of Microsoft Corporation.</p>
          <p className="mt-1">This site is not part of or endorsed by LinkedIn Corporation.</p>
        </div>
      </footer>
    </>
  );
}
