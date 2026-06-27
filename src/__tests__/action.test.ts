import { describe, it, expect, vi, beforeEach } from "vitest";

//Mock all dependency eksternal

// Di atas, sebelum semua vi.mock
// Deklarasi dengan vi.hoisted() — ini ikut naik ke atas
const { mockLimit } = vi.hoisted(() => ({
  mockLimit: vi.fn(),
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    limit = mockLimit;   // ← sekarang mockLimit udah ada waktu ini jalan
    static slidingWindow = vi.fn().mockReturnValue("mocked");
  },
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(),
    })),
    insert: vi.fn(() => ({
      where: vi.fn(),
    })),
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn().mockImplementation((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: vi.fn().mockReturnValue({}),
  },
}));

vi.mock("@/auth", () => ({
    auth: vi.fn(),
    signIn: vi.fn()
}))

//import setelahy mock (urutan penting!)
import { deleteNote, createNote } from "@/app/notes/action";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { loginAction } from "@/app/login/action";
import { signIn } from "@/auth";
import { Ratelimit } from "@upstash/ratelimit";

//reset semua mock sebelum tiap test pake beforeEach
beforeEach(() => {
  vi.clearAllMocks();
});

//  TEST 1: deleteNote - ownership check

describe("deleteNote", () => {
  it("harus redirect ke login kalau belum login", async () => {
    //Arrange: pura-pura belum login
    vi.mocked(auth).mockResolvedValue(null as any);

    //Act: jalanini deleteNote
    const formData = new FormData();
    formData.append("id", "1");

    await expect(deleteNote(formData)).rejects.toThrow("REDIRECT:/login");
  });

  it("berhasil hapus note milik sendiri", async () => {
    // Arrange: user id "1" login
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", email: "test@test.com", role: "user" },
    } as any);

    // Arrange: mock db.delete biar return sukses
    vi.mocked(db.delete).mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    } as any);

    // Act: hapus note id 5
    const formData = new FormData();
    formData.append("id", "5");
    await expect(deleteNote(formData)).rejects.toThrow("REDIRECT:/notes");

    // Assert: db.delete dipanggil
    expect(db.delete).toHaveBeenCalled();
  });
});

describe("loginAction — rate limiting", () => {
  it("kena rate limit → redirect too_many_attempts", async () => {
    mockLimit.mockResolvedValue({ success: false }); // ← langsung set limit-nya

    const formData = new FormData();
    formData.append("email", "test@test.com");
    formData.append("password", "test");
    await expect(loginAction(formData)).rejects.toThrow(
      "REDIRECT:/login?error=too_many_attempts",
    );
  });


  it("belum kena limit + password salah → redirect invalid_credentials", async () => {
    mockLimit.mockResolvedValue({ success: true }); // ← lolos limit

    const { AuthError } = await import("next-auth");
    vi.mocked(signIn).mockRejectedValue(new AuthError());

    const formData = new FormData();
    formData.append("email", "test@test.com");
    formData.append("password", "wrongpassword");
    await expect(loginAction(formData)).rejects.toThrow(
      "REDIRECT:/login?error=invalid_credentials",
    );
  });
});
