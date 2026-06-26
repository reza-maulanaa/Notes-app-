import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageEnter } from "@/components/PageEnter";
import { ChevronLeft, Pencil, PenLine } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailPage({ params }: Props) {
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

  const formattedDate = note.createdAt.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <PageEnter>
        {/* Top nav */}
        <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
            <Link href="/notes" className="flex items-center gap-1 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
              <ChevronLeft size={14} />
              Semua catatan
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
          <article className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            {/* Note header */}
            <header className="mb-5">
              <h1 className="text-2xl font-bold leading-tight tracking-[-0.03em] text-[var(--color-ink)]">
                {note.title}
              </h1>
              <time
                dateTime={note.createdAt.toISOString()}
                className="mt-1.5 block text-xs text-[var(--color-muted)]"
              >
                {formattedDate}
              </time>
            </header>

            <div className="mb-5 h-px bg-[var(--color-border)]" />

            <p className="text-sm leading-[1.8] text-[var(--color-ink)] whitespace-pre-wrap">
              {note.content}
            </p>
          </article>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <Link
              href={`/notes/${note.id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 py-2 text-xs font-medium text-[var(--color-ink)] transition-all hover:border-[var(--color-ink)] hover:shadow-sm active:scale-[0.98]"
            >
              <Pencil size={12} />
              Edit catatan
            </Link>
          </div>
        </main>
      </PageEnter>
    </div>
  );
}
