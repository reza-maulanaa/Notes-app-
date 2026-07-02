import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "15 m"),
});

export async function loginAction(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "anonymous";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    redirect("/login?error=too_many_attempts");
  }

  //Cek Email Verified
  const user = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  .then(res => res[0])

  if (user && !user.emailVerified) {
    redirect("/login?error=email_not_verified")
  }

  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo: "/notes",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=invalid_credentials");
    } else {
      throw error;
    }
  }
}
