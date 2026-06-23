"use server";

import { db } from "@/db";
import { notes } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function createNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await db.insert(notes).values({
    title,
    content,
    userId: Number(session.user.id),
  });
  revalidatePath("/notes");
  redirect("/notes")
}

export async function deleteNote(formData: FormData) {
  const session = await auth()
  if(!session?.user?.id) redirect("/login")

  const id = Number(formData.get("id"));

  await db.delete(notes).where(eq(notes.id, id));

  revalidatePath("/notes");
}

export async function updateNote(formData: FormData) {
  const session = await auth()
  if(!session?.user?.id) redirect("/login")

  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await db.update(notes).set({ title, content }).where(eq(notes.id, id));

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  revalidatePath(`/notes/${id}`);
}
