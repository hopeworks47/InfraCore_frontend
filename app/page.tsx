// app/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import HomeUI from "./components/HomeUI"

export default async function Home() {
  const session = await getServerSession(authOptions)
  const isAuthenticated = Boolean(session?.user?.accessToken)

  return <HomeUI isAuthenticated={isAuthenticated} />
}