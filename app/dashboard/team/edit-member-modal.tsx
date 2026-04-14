"use client";

interface EditMemberModalPropsExtended {
  isOpen: boolean;
  draftName: string;
  draftEmail: string;
  draftRole: "admin" | "leader" | "member";
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onRoleChange: (value: "admin" | "leader" | "member") => void;
  onCancel: () => void;
  onUpdate: () => void;
  isUpdateDisabled: boolean;
}

export default function EditMemberModal({
  isOpen,
  draftName,
  draftEmail,
  draftRole,
  onNameChange,
  onEmailChange,
  onRoleChange,
  onCancel,
  onUpdate,
  isUpdateDisabled,
}: EditMemberModalPropsExtended) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Update Member</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input
              value={draftName}
              onChange={(event) => onNameChange(event.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              value={draftEmail}
              onChange={(event) => onEmailChange(event.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select
              value={draftRole}
              onChange={(event) =>
                onRoleChange(event.target.value as "admin" | "leader" | "member")
              }
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="admin">admin</option>
              <option value="leader">leader</option>
              <option value="member">member</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onUpdate}
            disabled={isUpdateDisabled}
            className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
