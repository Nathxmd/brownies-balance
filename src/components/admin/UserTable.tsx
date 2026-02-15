"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ShieldCheck, ShieldAlert, Trash2 } from "lucide-react";
import { User, UserRole } from "@prisma/client";
import { updateUserRole } from "@/lib/actions/admin-actions";
import { useToast } from "@/hooks/use-toast";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const { toast } = useToast();

  const handleRoleUpdate = async (id: string, role: UserRole) => {
    const result = await updateUserRole(id, role);
    if (result.success) {
      toast({ title: "User role updated", description: `User is now ${role}` });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No staff members found.
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.name}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="text-xs">
                {new Date(user.createdAt).toLocaleDateString('id-ID')}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Manage Access</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, UserRole.ADMIN)}>
                      <ShieldCheck className="mr-2 h-4 w-4 text-amber-600" /> Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, UserRole.STAFF)}>
                      <ShieldAlert className="mr-2 h-4 w-4 text-blue-600" /> Make Staff
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 cursor-not-allowed opacity-50">
                      <Trash2 className="mr-2 h-4 w-4" /> Remove User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
