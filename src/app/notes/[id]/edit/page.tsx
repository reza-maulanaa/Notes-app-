import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { updateNote } from "@/app/notes/action";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageEnter } from "@/components/PageEnter";
import { ChevronLeft, PenLine } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditNotePage({ params }: Props) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const note = await db
    .select()
    .from(notes)
    .where(eq(notes.id, Number(id)))
    .then((res) => res[0]);

  if (!note) notFound();
  if (note.userId !== Number(session.user.id)) notFound();

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <PageEnter>
        {/* Top nav */}
        <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
            <Link
              href={`/notes/${id}`}
              className="flex items-center gap-1 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              <ChevronLeft size={14} />
              Kembali
            </Link>
            <Link href="/" className="flex items-center gap-1.5">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-md"
                style={{ backgroundColor: "var(--color-ink)" }}
              >
                <PenLine size={12} className="text-white" />
              </div>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-5 py-8 pb-20">
          <div className="mb-5">
            <h1 className="text-lg font-bold tracking-tight text-[var(--color-ink)]">
              Edit catatan
            </h1>
          </div>

          <form action={updateNote}>
            <input type="hidden" name="id" value={note.id} />

            <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm transition-shadow focus-within:shadow-md">
              <div className="px-5 pt-5">
                <input
                  name="title"
                  defaultValue={note.title}
                  required
                  autoComplete="off"
                  placeholder="Judul catatan..."
                  className="w-full border-none bg-transparent text-sm font-semibold text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none"
                  style={{ fontFamily: "inherit" }}
                />
              </div>
              <div className="mx-5 my-3 h-px bg-[var(--color-border)]" />
              <div className="px-5 pb-5">
                <textarea
                  name="content"
                  defaultValue={note.content}
                  required
                  rows={8}
                  placeholder="Tulis catatanmu..."
                  className="w-full resize-none border-none bg-transparent text-sm leading-relaxed text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none"
                  style={{ fontFamily: "inherit" }}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
                style={{ backgroundColor: "var(--color-ink)" }}
              >
                Simpan perubahan
              </button>
              <Link
                href={`/notes/${id}`}
                className="inline-flex items-center rounded-lg border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-all hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
              >
                Batal
              </Link>
            </div>
          </form>
        </main>
      </PageEnter>
    </div>
  );
}
