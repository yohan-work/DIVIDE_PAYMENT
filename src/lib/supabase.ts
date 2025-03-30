import { createClient } from "@supabase/supabase-js";

// 기본값 설정 (Vercel 배포 시에는 실제 환경 변수로 대체됨)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ylykmdbnljmxbstcebin.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlseWttZGJubGpteGJzdGNlYmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMzI1NjEsImV4cCI6MjA1ODcwODU2MX0.v9YWXe7qBgXXsoAMm7Gp2RS-HeO9AYXoRpSzQ3MyMok";

// 콘솔에 환경 변수 확인을 위한 로그 (디버깅용)
console.log("SUPABASE URL:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SUPABASE ANON KEY:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
