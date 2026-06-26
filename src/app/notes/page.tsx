import { db } from "@/db";
import { notes } from "@/db/schema";
import { deleteNote } from "./action";
import Link from "next/link";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { signOut } from "@/auth";
import NoteForm from "./NoteForm";
import { NoteListAnimated } from "@/components/NoteListAnimated";
import { PageEnter } from "@/components/PageEnter";
import { HeroSection } from "@/components/HeroSection";
import { PenLine, LogOut, Pencil, Trash2, FileText } from "lucide-react";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function NotesPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const session = await auth();

  // Belum login → tampilkan hero. User harus tekan tombol dulu untuk ke login/registrasi.
  if (!session?.user?.id) return <HeroSection />;

  const allNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, Number(session.user.id)));

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <PageEnter>
        {/* Top nav */}
        <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-md"
                style={{ backgroundColor: "var(--color-ink)" }}
              >
                <PenLine size={12} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-[var(--color-ink)]">Notes</span>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-danger)] cursor-pointer"
              >
                <LogOut size={13} />
                Logout
              </button>
            </form>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-5 py-8 pb-20">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-ink)]">
              Catatanmu
            </h1>
            <p className="mt-0.5 text-sm text-[var(--color-muted)]">
              {allNotes.length === 0
                ? "Belum ada catatan"
                : `${allNotes.length} catatan tersimpan`}
            </p>
          </div>

          {/* Error banners */}
          {error === "limit_reached_basic" && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              Batas maksimal 5 catatan untuk akun free. Upgrade ke premium untuk lebih banyak!
            </div>
          )}
          {error === "limit_reached_premium" && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              Batas maksimal 15 catatan untuk akun premium. Upgrade ke Max!
            </div>
          )}

          {/* Create form */}
          <NoteForm />

          {/* Notes list */}
          {allNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)]"
              >
                <FileText size={20} className="text-[var(--color-muted)]" />
              </div>
              <p className="text-sm text-[var(--color-muted)]">
                Buat catatan pertamamu di atas.
              </p>
            </div>
          ) : (
            <NoteListAnimated>
              {allNotes.map((note) => (
                <li key={note.id} className="group">
                  <div className="mb-2 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white transition-shadow hover:shadow-sm">
                    <div className="flex items-start justify-between gap-3 p-4">
                      <Link
                        href={`/notes/${note.id}`}
                        className="min-w-0 flex-1 block"
                        style={{ textDecoration: "none" }}
                      >
                        <span className="block truncate text-sm font-semibold leading-snug text-[var(--color-ink)]">
                          {note.title}
                        </span>
                        <span className="mt-1 block truncate text-xs leading-relaxed text-[var(--color-muted)]">
                          {note.content}
                        </span>
                      </Link>
                      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <Link
                          href={`/notes/${note.id}/edit`}
                          aria-label={`Edit "${note.title}"`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
                        >
                          <Pencil size={13} />
                        </Link>
                        <form action={deleteNote} className="shrink-0">
                          <input type="hidden" name="id" value={note.id} />
                          <button
                            type="submit"
                            aria-label={`Hapus "${note.title}"`}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </NoteListAnimated>
          )}
        </main>
      </PageEnter>
    </div>
  );
}
