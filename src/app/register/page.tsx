import { PenLine } from "lucide-react";
import { registerAction } from "./action";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-4">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.700 0.008 28) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--color-ink)" }}
            >
              <PenLine size={15} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-[var(--color-ink)]">Notes</span>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-ink)]">
              Buat akun baru
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Gratis selamanya, tanpa kartu kredit
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          {error === "email_taken" && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
              Email sudah terdaftar. Coba masuk atau gunakan email lain.
            </div>
          )}
          {error === "invalid_input" && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
              Email tidak valid atau password kurang dari 8 karakter.
            </div>
          )}
          <form action={registerAction} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-ink)]">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="kamu@email.com"
                className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] transition-colors focus:border-[var(--color-ink)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-ink)]">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
                className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] transition-colors focus:border-[var(--color-ink)] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: "var(--color-ink)" }}
            >
              Buat akun
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
            Dengan mendaftar, kamu menyetujui syarat penggunaan.
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-[var(--color-muted)]">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-[var(--color-ink)] hover:underline">
            Masuk sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
