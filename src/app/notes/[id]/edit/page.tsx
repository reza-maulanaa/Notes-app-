import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { updateNote } from "@/app/notes/action";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

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
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
      <main
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Back nav */}
        <nav style={{ marginBottom: "32px" }}>
          <Link
            href={`/notes/${id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "13px",
              color: "var(--color-muted)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8.5 2.5 4 7l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Kembali
          </Link>
        </nav>

        {/* Page heading */}
        <header style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            Edit catatan
          </h1>
        </header>

        {/* Edit form */}
        <form action={updateNote}>
          <input type="hidden" name="id" value={note.id} />

          <div
            style={{
              padding: "20px",
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              marginBottom: "16px",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <input
                name="title"
                defaultValue={note.title}
                required
                autoComplete="off"
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "var(--color-ink)",
                  outline: "none",
                  fontFamily: "inherit",
                  letterSpacing: "-0.01em",
                  padding: 0,
                }}
              />
            </div>
            <div
              style={{
                height: "1px",
                backgroundColor: "var(--color-border)",
                marginBottom: "12px",
              }}
            />
            <div>
              <textarea
                name="content"
                defaultValue={note.content}
                required
                rows={6}
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  fontSize: "14px",
                  color: "var(--color-ink)",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.7,
                  padding: 0,
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-fg)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "7px 16px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "0.01em",
              }}
            >
              Simpan
            </button>
            <Link
              href={`/notes/${id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 16px",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--color-muted)",
                backgroundColor: "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              Batal
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
