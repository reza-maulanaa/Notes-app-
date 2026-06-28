import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

//generate token random pake crypto
export function generateVerifyToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

//kirim email verifikasi
export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<void> {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "rezzreborn@gmail.com",
    subject: "Verifikasi email kamu — Notes App",
    html: `
      <h2>Verifikasi email kamu</h2>
      <p>Klik link di bawah untuk mengaktifkan akun kamu:</p>
      <a href="${verifyUrl}">Verifikasi Sekarang</a>
      <p>Link ini expired dalam 24 jam.</p>
    `,
  });
}