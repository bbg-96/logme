import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserAreaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  const session = verifySessionToken(token);
  if (!session) {
    redirect("/login");
  }

  if (session.username !== params.username) {
    redirect(`/u/${session.username}/today`);
  }

  return <>{children}</>;
}
