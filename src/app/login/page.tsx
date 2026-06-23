import { signIn } from "@/auth";

async function loginAction(formData: FormData) {
  "use server";
  await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/notes",
  });
}

async function githubAction() {
  "use server";
  await signIn("github", { redirectTo: "/notes" });
}

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto p-8 mt-20">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

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
          className="w-full border rounded-lg py-2 text-sm hover:bg-gray-50"
        >
          Login dengan GitHub
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
