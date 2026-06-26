import { db } from "@/db";
import { notes } from "@/db/schema";
import { createNote, deleteNote } from "./action";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { signOut } from "@/auth";
import NoteForm from "./NoteForm";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function NotesPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const allNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, Number(session.user.id)));

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <main
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: "40px" }}>
          <div className="flex justify-between">
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--color-ink)",
                margin: 0,
              }}
            >
              Notes
            </h1>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="text-sm text-red-600 hover:text-black"
              >
                Logout
              </button>
            </form>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-muted)",
              marginTop: "4px",
            }}
          >
            {allNotes.length === 0
              ? "Belum ada catatan"
              : `${allNotes.length} catatan`}
          </p>
        </header>

        {/* Error message — letakkan di sini, SETELAH header */}
        {error === "limit_reached_basic" && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              marginBottom: "24px",
              fontSize: "13px",
              color: "#dc2626",
            }}
          >
            Batas maksimal 5 notes untuk akun free. Upgrade ke premium!
          </div>
        )}
        {error === "limit_reached_premium" && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              marginBottom: "24px",
              fontSize: "13px",
              color: "#dc2626",
            }}
          >
            Batas maksimal 15 notes untuk akun premium. Upgrade ke Max!
          </div>
        )}

        {/* Create form */}
        <NoteForm />

        {/* Notes list */}
        {allNotes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "var(--color-muted)",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Buat catatan pertamamu di atas.
            </p>
          </div>
        ) : (
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {allNotes.map((note, index) => (
              <li
                key={note.id}
                style={{
                  borderTop:
                    index === 0 ? "1px solid var(--color-border)" : "none",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "16px 0",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      href={`/notes/${note.id}`}
                      style={{
                        display: "block",
                        textDecoration: "none",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "var(--color-ink)",
                          letterSpacing: "-0.01em",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {note.title}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: "13px",
                          color: "var(--color-muted)",
                          marginTop: "2px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {note.content}
                      </span>
                    </Link>
                  </div>
                  <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                    <Link
                      href={`/notes/${note.id}/edit`}
                      aria-label={`Edit "${note.title}"`}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        color: "var(--color-muted)",
                        fontSize: "16px",
                        lineHeight: 1,
                        borderRadius: "var(--radius-sm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0.5,
                        textDecoration: "none",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
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
                    </Link>
                    <form action={deleteNote} style={{ flexShrink: 0 }}>
                      <input type="hidden" name="id" value={note.id} />
                      <button
                        type="submit"
                        aria-label={`Hapus "${note.title}"`}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "4px",
                          color: "var(--color-muted)",
                          fontFamily: "inherit",
                          fontSize: "16px",
                          lineHeight: 1,
                          borderRadius: "var(--radius-sm)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0.5,
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
                            d="M2 3.5h10M5 3.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1M5.5 6v4M8.5 6v4M3 3.5l.5 7a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5l.5-7"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
