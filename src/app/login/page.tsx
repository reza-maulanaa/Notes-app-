import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
interface Props {
  searchParams: Promise<{ error?: string }>;
}

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "15 m"),
});

async function loginAction(formData: FormData) {
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

async function githubAction() {
  "use server";
  await signIn("github", { redirectTo: "/notes" });
}

async function googleAction() {
  "use server";
  await signIn("google", { redirectTo: "/notes" });
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <main className="max-w-md mx-auto p-8 mt-20">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      {error === "too_many_attempts" && (
        <div className="text-red-600 text-sm mb-2">
          Terlalu banyak percobaan. Coba lagi dalam 15 menit.
        </div>
      )}

      {error === "invalid_credentials" && (
        <div className="text-red-600 text-sm mb-2">
          Email atau password salah.
        </div>
      )}
      <form action={loginAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Masuk
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">atau</span>
        </div>
      </div>

      {/* Form GitHub di LUAR form credentials */}
      <form action={githubAction}>
        <button
          type="submit"
          className="w-full mb-3 bg-gray-950 text-amber-50 border rounded-lg py-2 text-sm hover:bg-gray-500"
        >
          Login dengan GitHub
        </button>
      </form>

      <form action={googleAction}>
        <button
          type="submit"
          className="w-full border rounded-lg py-2 text-sm hover:bg-gray-200"
        >
          Login dengan Google
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4">
        Belum punya akun?{" "}
        <a href="/register" className="text-blue-500">
          Daftar
        </a>
      </p>
    </main>
  );
}
