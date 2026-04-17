"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import TeamMembersTable from "./team-members-table";
import AddMemberModal from "./add-member-modal";

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

export default function TeamPage() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const team = useAppSelector((state) => state.user.users || []);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeamMembers = async () => {
      const token = session?.user?.accessToken;
      if (!token) return;

      try {
        const members = await getTeamMembers(token);
        // Populate the Redux store with the team members
        dispatch(setUser({ users: members }));
        setError(null);
      } catch (err) {
        setError("Unable to load team members.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamMembers();
  }, [session?.user?.accessToken, dispatch]);

  const handleAddMemberSuccess = () => {
    // No need to manually add to state since Redux store handles it
    setIsAddModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Add User
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {!error && !isLoading && <TeamMembersTable members={team} />}
      {isLoading && <p className="text-gray-500">Loading team members...</p>}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onAddSuccess={handleAddMemberSuccess}
      />
    </div>
  );
}