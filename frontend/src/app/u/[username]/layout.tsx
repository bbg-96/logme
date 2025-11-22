import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserAreaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // ✅ Next 16에서는 params가 Promise 형태라고 보고 타입도 이렇게 맞춰주기
  params: Promise<{ username: string }>;
}) {
  // cookies()는 이미 async 처리함
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  const session = verifySessionToken(token);
  if (!session) {
    redirect("/login");
  }

  // ✅ 여기서 params를 한 번 await 해서 실제 값 꺼냄
  const { username } = await params;

  if (session.username !== username) {
    redirect(`/u/${session.username}/today`);
  }

  return <>{children}</>;
}
