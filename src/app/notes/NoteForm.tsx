"use client"

import { useRef } from "react";
import { createNote } from "./action";

export default function NoteForm() {

    const formRef = useRef<HTMLFormElement>(null)

    function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if(event.key === "Enter" && !event.shiftKey){
            event.preventDefault()
            formRef.current?.requestSubmit()
        } 
    }
  return (
    <form
      ref= {formRef}
      action={createNote}
      style={{
        marginBottom: "40px",
        padding: "20px",
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div style={{ marginBottom: "12px" }}>
        <input
          name="title"
          placeholder="Judul"
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
      <div style={{ marginBottom: "16px" }}>
        <textarea
          name="content"
          placeholder="Tulis catatan..."
          onKeyDown={handleKeyDown}
          required
          rows={10}
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            fontSize: "14px",
            color: "var(--color-ink)",
            outline: "none",
            resize: "none",
            fontFamily: "inherit",
            lineHeight: 1.6,
            padding: 0,
          }}
        />
      </div>
    </form>
  );
}
