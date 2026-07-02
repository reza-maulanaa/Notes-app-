import { db } from "@/db";
import { users } from "@/db/schema";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateVerifyToken, sendVerificationEmail } from "@/lib/email";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerAction(formData: FormData) {
  "use server";

  const result = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    redirect("/register?error=invalid_input");
  }

  const { email, password } = result.data;

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0]);

  if (existing) {
    redirect("/register?error=email_taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = generateVerifyToken();
  const tokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.insert(users).values({
    email,
    password: hashedPassword,
    verifyToken: token,
    verifyTokenExp: tokenExp,
  });

  await sendVerificationEmail(email, token);
  redirect("/register/check-email");
}
