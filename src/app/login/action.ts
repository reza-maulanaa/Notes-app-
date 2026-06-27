import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { redirect } from "next/navigation";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "15 m"),
});

export async function loginAction(formData: FormData) {
  "use server";

  const ip = "anonymous";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    redirect("/login?error=too_many_attempts");
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
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
