"use server";

import { db } from "@/db";
import { notes } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { z } from "zod";

const noteSchema = z.object({
  title: z
    .string()
    .min(1, "Judul terlalu sedikit")
    .max(50, "Judul terlalu panjang"),
  content: z
    .string()
    .min(1, "Isi terlalu sedikit")
    .max(300, "Isi terlalu banyak"),
});

const updateNoteSchema = noteSchema.extend({
  id: z.number().positive(),
});

export async function createNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, Number(session.user.id)));

  if (session.user.role === "user" && userNotes.length >= 5) {
    redirect("/notes?error=limit_reached_basic");
  }
  if (session.user.role === "premium" && userNotes.length >= 15) {
    redirect("/notes?error=limit_reached_premium");
  }

  const result = noteSchema.safeParse({
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  });

  if (!result.success) {
    redirect("/notes?error=invalid_input");
  }

  const { title, content } = result.data;

  await db.insert(notes).values({
    title,
    content,
    userId: Number(session.user.id),
  });

  revalidatePath("/notes");
  redirect("/notes");
}

export async function deleteNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const id = Number(formData.get("id"));

  await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, Number(session.user.id))));

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const result = updateNoteSchema.safeParse({
    id: Number(formData.get("id")),
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  });

  if (!result.success) {
    redirect("/notes?error=invalid_input");
  }

  const { id, title, content } = result.data;

  await db
    .update(notes)
    .set({ title, content })
    .where(and(eq(notes.id, id), eq(notes.userId, Number(session.user.id))));

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  redirect(`/notes/${id}`);
}
