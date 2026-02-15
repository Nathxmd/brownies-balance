import { getAdminUsers } from "@/lib/actions/admin-actions";
import { UserTable } from "@/components/admin/UserTable";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <p className="text-muted-foreground">
          Manage your team members, update roles, and control access.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <UserTable users={users} />
      </div>
    </div>
  );
}
