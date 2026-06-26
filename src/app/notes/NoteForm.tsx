"use client";

import { useRef } from "react";
import { createNote } from "./action";
import { CornerDownLeft } from "lucide-react";

export default function NoteForm() {
  const formRef = useRef<HTMLFormElement>(null);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <form
      ref={formRef}
      action={createNote}
      className="mb-5 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm transition-shadow focus-within:shadow-md"
    >
      <div className="px-4 pt-4">
        <input
          name="title"
          placeholder="Judul catatan..."
          required
          autoComplete="off"
          className="w-full border-none bg-transparent text-sm font-semibold text-[var(--color-ink)] placeholder:text-[oklch(0.72_0.008_28)] outline-none"
          style={{ fontFamily: "inherit" }}
        />
      </div>
      <div className="mx-4 my-2 h-px bg-[var(--color-border)]" />
      <div className="px-4">
        <textarea
          name="content"
          placeholder="Tulis catatanmu di sini... (Enter untuk simpan)"
          onKeyDown={handleKeyDown}
          required
          rows={4}
          className="w-full resize-none border-none bg-transparent text-sm leading-relaxed text-[var(--color-ink)] placeholder:text-[oklch(0.72_0.008_28)] outline-none"
          style={{ fontFamily: "inherit" }}
        />
      </div>
      <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5">
        <p className="text-xs text-[var(--color-muted)]">
          <kbd className="rounded border border-[var(--color-border)] bg-white px-1.5 py-0.5 font-mono text-[10px]">
            Enter
          </kbd>{" "}
          untuk menyimpan
        </p>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all hover:opacity-90 active:scale-[0.97] cursor-pointer"
          style={{ backgroundColor: "var(--color-ink)" }}
        >
          <CornerDownLeft size={12} />
          Simpan
        </button>
      </div>
    </form>
  );
}
