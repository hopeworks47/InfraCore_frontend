import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getTeamMembers(accessToken: string) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL in environment configuration");
  }
  const res = await fetch(`${apiBaseUrl}/api/v1/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch team");
  return res.json();
}

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;
  let team = [];
  let error = null;

  try {
    if (token) team = await getTeamMembers(token);
  } catch (err) {
    error = "Unable to load team members.";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Team Members</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {team.map((member: any) => (
          <li key={member.id} className="border p-3 rounded">
            {member.name} ({member.email})
          </li>
        ))}
      </ul>
    </div>
  );
}