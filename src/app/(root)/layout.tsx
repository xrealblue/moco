import Header from "@/components/Header"
import { auth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const Layout = async ({ children }: { children: React.ReactNode }) => {
  console.log("Layout: Fetching session...");
  const session = await auth.api.getSession({
    headers: await headers()
  });
  console.log("Layout: Session result:", session ? "Session found" : "No session");

  if (!session?.user) {
    console.log("Layout: No user in session, redirecting to /sign-in");
    redirect('/sign-in');
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  }

  return (
    <main className="min-h-screen w-full ">
      <Header user={user} />

      <div className="w-full py-10">
        {children}
      </div>
    </main>
  )
}

export default Layout
