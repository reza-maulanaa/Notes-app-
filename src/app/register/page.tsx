import { db } from "@/db";
import { users } from "@/db/schema";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

async function registerAction(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  //hash password sebelum disimpan
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    email,
    password: hashedPassword,
  });

  redirect("/login");
}

export default function RegisterPage() {
  return (
    <main className="max-w-md mx-auto p-8 mt-20">
      <h1 className="text-2xl font-bold mb-6">Buat Akun</h1>

      <form action={registerAction} className="space-y-4">
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
          Daftar
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4">
        Sudah punya akun?{" "}
        <a href="/login" className="text-blue-500">
          Login
        </a>
      </p>
    </main>
  );
}
