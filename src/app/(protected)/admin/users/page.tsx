"use client";

import { columns } from "@/app/(protected)/admin/users/table/columns";
import { UsersTable } from "@/app/(protected)/admin/users/table/data-table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const UsersPage = () => {
  return <UsersTable columns={columns} />;
};

export default UsersPage;
