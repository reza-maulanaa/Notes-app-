import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

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
            href="/notes"
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
            Notes
          </Link>
        </nav>

        {/* Note content */}
        <article>
          <header style={{ marginBottom: "24px" }}>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--color-ink)",
                margin: 0,
                lineHeight: 1.3,
                textWrap: "balance",
              }}
            >
              {note.title}
            </h1>
            <time
              dateTime={note.createdAt.toISOString()}
              style={{
                display: "block",
                fontSize: "12px",
                color: "var(--color-muted)",
                marginTop: "8px",
                letterSpacing: "0.01em",
              }}
            >
              {formattedDate}
            </time>
          </header>

          <div
            style={{
              height: "1px",
              backgroundColor: "var(--color-border)",
              marginBottom: "24px",
            }}
          />

          <p
            style={{
              fontSize: "15px",
              color: "var(--color-ink)",
              lineHeight: 1.7,
              margin: 0,
              whiteSpace: "pre-wrap",
              maxWidth: "65ch",
            }}
          >
            {note.content}
          </p>
        </article>

        {/* Actions */}
        <footer
          style={{
            marginTop: "40px",
            display: "flex",
            gap: "8px",
          }}
        >
          <Link
            href={`/notes/${note.id}/edit`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--color-ink)",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              letterSpacing: "0.01em",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9.5 1.5a1.414 1.414 0 0 1 2 2L4.5 10.5l-3 1 1-3 7-7Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Edit
          </Link>
        </footer>
      </main>
    </div>
  );
}
