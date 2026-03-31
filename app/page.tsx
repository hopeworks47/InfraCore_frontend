import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">InfraCore Admin</h1>
        <p className="mt-4">Please <a href="/login" className="text-blue-600">login</a> to continue.</p>
      </div>
    </div>
  );
}