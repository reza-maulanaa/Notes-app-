import { db } from "@/db";
import { users } from "@/db/schema";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { generateVerifyToken, sendVerificationEmail } from "@/lib/email";

export async function registerAction(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const hashedPassword = await bcrypt.hash(password, 10);

  //generate token
  const token = generateVerifyToken();

  //token expired dalam 24 jam dari sekarang
  const tokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

  //insert user dengan token
  await db.insert(users).values({
    email,
    password: hashedPassword,
    verifyToken: token,
    verifyTokenExp: tokenExp,
    // emailVerified: null (default, belum verified)
  });

  await sendVerificationEmail(email, token);

  redirect("/register/check-email");
}
