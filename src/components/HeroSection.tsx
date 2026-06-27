"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { ArrowRight, PenLine, Shield, Zap, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: PenLine,
    title: "Tulis tanpa hambatan",
    desc: "Editor bersih yang menyingkirkan gangguan. Fokus hanya pada tulisanmu.",
  },
  {
    icon: Shield,
    title: "Privat & Aman",
    desc: "Catatanmu hanya untuk kamu. Disimpan dengan aman, hanya bisa diakses olehmu.",
  },
  {
    icon: Zap,
    title: "Cepat & Ringan",
    desc: "Tidak ada loading lambat. Tulis, simpan, selesai — dalam hitungan detik.",
  },
];

const STATS = [
  { value: "0.3s", label: "Waktu simpan" },
  { value: "100%", label: "Privat" },
  { value: "∞", label: "Catatan" },
];

const MOCK_CARDS = [
  {
    id: 1,
    emoji: "🗒️",
    title: "Meeting Q3",
    lines: ["• Diskusi roadmap produk", "• Review timeline sprint", "• Budget planning 2025"],
    baseRot: -3,
    position: "top-6 right-6",
    depth: 0.04,
  },
  {
    id: 2,
    emoji: "💡",
    title: "Ide Startup",
    lines: ["Aplikasi minimalis untuk", "mencatat setiap inspirasi", "sebelum menghilang..."],
    baseRot: 2,
    position: "top-44 right-28",
    depth: 0.09,
  },
  {
    id: 3,
    emoji: "📖",
    title: "Bacaan Minggu Ini",
    lines: ["☐ Atomic Habits", "☑ Deep Work", "☐ The Creative Act"],
    baseRot: -1,
    position: "top-80 right-4",
    depth: 0.06,
  },
];

const ORB_DEPTHS = [0.03, 0.05, 0.04];

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const magneticRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    // ---- Declarative animations (auto-reverted by ctx.revert) ----
    // Channel split to avoid property conflicts:
    //   entrance  -> opacity / scale / y (one-shot)
    //   float     -> yPercent / rotation (looping)
    //   drift     -> xPercent / yPercent (looping)
    //   parallax  -> x / y (pointer, set up separately below)
    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>(".mock-card");

      // Base rotation per card (independent of float/parallax channels).
      cardEls.forEach((card) => {
        gsap.set(card, { rotation: Number(card.dataset.rot ?? 0) });
      });

      // Ambient layers fade in parallel — they never block the text/CTA path.
      gsap.from([orb1Ref.current, orb2Ref.current, orb3Ref.current], {
        opacity: 0,
        scale: 0.7,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.out",
      });

      // Critical path: nav → badge → title → subtitle → CTA → stats, all in ~1s.
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(navRef.current, { y: -20, opacity: 0, duration: 0.5 }, 0);
      tl.from(badgeRef.current, { y: 14, opacity: 0, duration: 0.45 }, 0.1);
      tl.from(
        [line1Ref.current, line2Ref.current],
        { y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power4.out" },
        0.2
      );
      tl.from(subtitleRef.current, { y: 16, opacity: 0, duration: 0.45 }, 0.45);
      tl.from(ctaRef.current, { y: 14, opacity: 0, duration: 0.45 }, 0.6);
      if (statsRef.current) {
        tl.from(
          statsRef.current.children,
          { y: 12, opacity: 0, stagger: 0.07, duration: 0.4 },
          0.75
        );
      }

      // Cards + features fade in alongside, slightly delayed.
      if (cardEls.length) {
        gsap.from(cardEls, {
          autoAlpha: 0,
          scale: 0.92,
          stagger: 0.1,
          duration: 0.6,
          delay: 0.35,
          ease: "power3.out",
        });
      }
      if (featuresRef.current) {
        gsap.from(featuresRef.current.querySelectorAll(".feature-item"), {
          y: 24,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          delay: 0.6,
          ease: "power3.out",
        });
      }

      // Continuous float (yPercent + rotation — independent from parallax x/y).
      cardEls.forEach((card, i) => {
        const baseRot = Number(card.dataset.rot ?? 0);
        const dir = i % 2 === 0 ? -1 : 1;
        gsap.to(card, {
          yPercent: dir * 6,
          rotation: baseRot + dir * 1.5,
          duration: 2.8 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.6 + i * 0.35,
        });
      });

      // Orb drift (xPercent + yPercent — independent from parallax x/y).
      const drift = (
        el: HTMLDivElement | null,
        xp: number,
        yp: number,
        dur: number,
        delay: number
      ) => {
        if (!el) return;
        gsap.to(el, {
          xPercent: xp,
          yPercent: yp,
          duration: dur,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay,
        });
      };
      drift(orb1Ref.current, 5, -4, 7, 0);
      drift(orb2Ref.current, -5, 4, 9, 1);
      drift(orb3Ref.current, 4, 5, 8, 0.5);
    }, heroRef);

    // ---- Pointer interactions (desktop, fine pointer only) ----
    // Created outside the context so we fully own their listener cleanup.
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const disposers: Array<() => void> = [];

    if (mq.matches) {
      const cardEls = Array.from(root.querySelectorAll<HTMLElement>(".mock-card"));
      const cardMovers = cardEls.map((node) => ({
        xTo: gsap.quickTo(node, "x", { duration: 0.8, ease: "power3" }),
        yTo: gsap.quickTo(node, "y", { duration: 0.8, ease: "power3" }),
        depth: Number(node.dataset.depth ?? 0.05),
      }));

      const orbNodes = [orb1Ref.current, orb2Ref.current, orb3Ref.current];
      const orbMovers = orbNodes.flatMap((node, i) =>
        node
          ? [
              {
                xTo: gsap.quickTo(node, "x", { duration: 1.2, ease: "power3" }),
                yTo: gsap.quickTo(node, "y", { duration: 1.2, ease: "power3" }),
                depth: ORB_DEPTHS[i] ?? 0.04,
              },
            ]
          : []
      );

      const onMove = (e: MouseEvent) => {
        const dx = e.clientX - window.innerWidth / 2;
        const dy = e.clientY - window.innerHeight / 2;
        for (const m of cardMovers) {
          m.xTo(-dx * m.depth);
          m.yTo(-dy * m.depth);
        }
        for (const m of orbMovers) {
          m.xTo(-dx * m.depth);
          m.yTo(-dy * m.depth);
        }
      };
      window.addEventListener("mousemove", onMove);
      disposers.push(() => window.removeEventListener("mousemove", onMove));

      // Magnetic CTA
      const btn = magneticRef.current;
      if (btn) {
        const bx = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" });
        const by = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3" });
        const onBtnMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          bx((e.clientX - (r.left + r.width / 2)) * 0.4);
          by((e.clientY - (r.top + r.height / 2)) * 0.4);
        };
        const onBtnLeave = () => {
          bx(0);
          by(0);
        };
        btn.addEventListener("mousemove", onBtnMove);
        btn.addEventListener("mouseleave", onBtnLeave);
        disposers.push(() => {
          btn.removeEventListener("mousemove", onBtnMove);
          btn.removeEventListener("mouseleave", onBtnLeave);
        });
      }
    }

    return () => {
      disposers.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden bg-white">
      {/* Gradient mesh background */}
      <div
        ref={orb1Ref}
        className="pointer-events-none absolute -top-40 left-[15%] h-[620px] w-[620px] rounded-full opacity-[0.08] blur-[20px]"
        style={{ background: "radial-gradient(circle, oklch(0.548 0.210 28) 0%, transparent 70%)" }}
      />
      <div
        ref={orb2Ref}
        className="pointer-events-none absolute -right-32 top-1/4 h-[440px] w-[440px] rounded-full opacity-[0.06] blur-[10px]"
        style={{ background: "radial-gradient(circle, oklch(0.548 0.210 28) 0%, transparent 70%)" }}
      />
      <div
        ref={orb3Ref}
        className="pointer-events-none absolute bottom-10 left-[5%] h-[360px] w-[360px] rounded-full opacity-[0.05] blur-[10px]"
        style={{ background: "radial-gradient(circle, oklch(0.620 0.140 250) 0%, transparent 70%)" }}
      />
      {/* Fine grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.918 0.006 28 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.918 0.006 28 / 0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      {/* Nav — floating pill */}
      <nav ref={navRef} className="relative z-20 mx-auto max-w-6xl px-6 pt-5">
        <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-2.5 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--color-ink)" }}
            >
              <PenLine size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-[var(--color-ink)]">
              Notes
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-xl px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ backgroundColor: "var(--color-ink)" }}
            >
              Daftar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-14 md:pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Text */}
          <div>
            <div ref={badgeRef} className="mb-6">
              <Badge variant="primary">
                <Sparkles size={12} />
                Open Beta · Gratis selamanya
              </Badge>
            </div>

            <h1 className="mb-5 text-[clamp(2.5rem,5.2vw,4.2rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[var(--color-ink)]">
              <span ref={line1Ref} className="block">
                Pikiran jernih,
              </span>
              <span ref={line2Ref} className="block italic">
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(110deg, oklch(0.548 0.210 28), oklch(0.620 0.180 350))",
                  }}
                >
                  catatan yang jelas.
                </span>
              </span>
            </h1>

            <p
              ref={subtitleRef}
              className="mb-8 max-w-md text-base leading-relaxed text-[var(--color-muted)] md:text-lg"
            >
              Tulis ide, simpan momen, susun pikiran. Notes yang sederhana,{" "}
              intuitif, dan selalu siap saat kamu butuhkan.
            </p>

            <div ref={ctaRef} className="flex flex-wrap items-center gap-3">
              <Link
                ref={magneticRef}
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[oklch(0.145_0.015_28_/_0.15)] transition-[opacity,box-shadow] hover:opacity-95 hover:shadow-xl"
                style={{ backgroundColor: "var(--color-ink)" }}
              >
                Mulai Menulis
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white/80 px-6 py-3.5 text-sm font-medium text-[var(--color-ink)] backdrop-blur-sm transition-all hover:border-[var(--color-ink)] hover:shadow-sm active:scale-[0.98]"
              >
                Sudah punya akun
              </Link>
            </div>

            <p className="mt-4 text-xs text-[var(--color-muted)]">
              Tidak perlu kartu kredit · Login dengan GitHub atau Google
            </p>

            {/* Stats */}
            <div
              ref={statsRef}
              className="mt-10 flex max-w-md items-center gap-8 border-t border-[var(--color-border)] pt-6"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
                    {s.value}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--color-muted)]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating note cards */}
          <div ref={cardsRef} className="relative hidden h-[480px] lg:block">
            {MOCK_CARDS.map((card) => (
              <div
                key={card.id}
                data-depth={card.depth}
                data-rot={card.baseRot}
                className={`mock-card absolute ${card.position} w-52 rounded-2xl border border-[var(--color-border)] bg-white/90 p-4 shadow-[0_8px_40px_rgba(0,0,0,0.1)] backdrop-blur-sm`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-base">{card.emoji}</span>
                  <span className="text-xs font-semibold text-[var(--color-ink)]">{card.title}</span>
                </div>
                <div className="mb-2 h-px bg-[var(--color-border)]" />
                {card.lines.map((line, i) => (
                  <p key={i} className="text-xs leading-5 text-[var(--color-muted)]">
                    {line}
                  </p>
                ))}
              </div>
            ))}

            {/* Dot background */}
            <div
              className="absolute inset-0 -z-10 opacity-40"
              style={{
                backgroundImage: "radial-gradient(circle, oklch(0.700 0.008 28) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        ref={featuresRef}
        className="relative z-10 border-t border-[var(--color-border)] bg-[var(--color-surface)]"
      >
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-item group">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white transition-all group-hover:-translate-y-0.5 group-hover:shadow-sm">
                  <Icon size={17} style={{ color: "var(--color-primary)" }} />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-[var(--color-ink)]">{title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <footer className="relative z-10 border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-xs text-[var(--color-muted)]">© 2025 Notes. Dibuat dengan cermat.</p>
          <div className="flex gap-4 text-xs text-[var(--color-muted)]">
            <Link href="/login" className="hover:text-[var(--color-ink)]">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-[var(--color-ink)]">
              Daftar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
