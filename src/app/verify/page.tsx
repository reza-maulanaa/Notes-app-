// src/app/verify/page.tsx
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyPage({ searchParams }: Props) {
  const { token } = await searchParams;

  console.log("TOKEN DARI URL:", token);

  if (!token) redirect("/login?error=invalid_token");

  const user = await db
    .select()
    .from(users)
    .where(eq(users.verifyToken, token))
    .then((res) => res[0]);

  console.log("USER DITEMUKAN:", user);

  if (!user) redirect("/login?error=invalid_token");

  if (!user.verifyTokenExp || user.verifyTokenExp < new Date()) {
    redirect("/login?error=token_expired");
  }

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      verifyToken: null,
      verifyTokenExp: null,
    })
    .where(eq(users.id, user.id));

  redirect("/login?verified=true");
}
