"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import EditMemberModal from "./edit-member-modal";
import type { TeamMember } from "@/types/user.types";

type TeamMembersTableProps = {
  members: TeamMember[];
};

const PAGE_SIZE = 5;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function formatJoinedDate(member: TeamMember) {
  const value = member.created_at;
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

export default function TeamMembersTable({ members }: TeamMembersTableProps) {
  const [rows, setRows] = useState<TeamMember[]>(members);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, safePage]);

  const handleStartEdit = (member: TeamMember) => {
    setEditingMemberId(member._id);
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingMemberId(null);
  };

  const handleDelete = (memberId: string) => {
    setRows((prev) => {
      const updated = prev.filter((member) => member._id !== memberId);
      const updatedTotalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
      setCurrentPage((page) => Math.min(page, updatedTotalPages));
      return updated;
    });
    if (editingMemberId === memberId && isEditModalOpen) {
      handleCancelEdit();
    }
  };

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
        No team members found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                No.
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Profile Image
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Name
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Role
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Joined Date
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {pagedRows.map((member, index) => {
              console.log("Rendering member:", `${apiBaseUrl}${member.profile_image}`);
              const serialNumber = (safePage - 1) * PAGE_SIZE + index + 1;
              return (
                <tr key={member._id}>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">
                    {serialNumber}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">
                    {member.profile_image ? (
                      <Image
                        src={`${apiBaseUrl}${member.profile_image}`}
                        alt={`${member.name || "Member"}'s profile`}
                        width={32}
                        height={32}
                        unoptimized
                        className="mx-auto h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="mx-auto h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          {member.name ? member.name.charAt(0).toUpperCase() : "?"}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">
                    {member.name ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">
                    {member.email ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">
                    {member.role ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">
                    {formatJoinedDate(member)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    <div className="inline-flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(member)}
                        aria-label="Update member"
                        className="rounded border border-blue-200 p-2 text-blue-700 hover:bg-blue-50"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 20h4l10-10-4-4L4 16v4z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(member._id)}
                        aria-label="Delete member"
                        className="rounded border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M6 7h12M9 7V5h6v2m-7 3v7m4-7v7m4-10-1 12H9L8 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <EditMemberModal
        key={`${editingMemberId || "new"}-${isEditModalOpen}`}
        isOpen={isEditModalOpen}
        member={rows.find((m) => m._id === editingMemberId) || null}
        onCancel={handleCancelEdit}
        onUpdateSuccess={(updatedMember) => {
          console.log("handleUpdateMemberSuccess called with:", updatedMember);
          setRows((prev) => {
            const updated = prev.map((member) =>
              member._id === updatedMember._id ? updatedMember : member
            );
            console.log("Updated rows:", updated);
            return updated;
          });
          handleCancelEdit();
        }}
      />

      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {(safePage - 1) * PAGE_SIZE + 1}-
          {Math.min(safePage * PAGE_SIZE, rows.length)} of {rows.length}
        </p>
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safePage === 1}
            className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={safePage === totalPages}
            className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
