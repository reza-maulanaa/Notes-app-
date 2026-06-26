import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// 1. bikin koneksi HTTP ke Neon
const sql = neon(process.env.DATABASE_URL!)

// 2. kasih ke drizzle
export const db = drizzle(sql)