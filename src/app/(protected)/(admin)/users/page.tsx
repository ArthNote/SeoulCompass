import { columns, User } from "@/app/(protected)/(admin)/users/table/columns";
import { DataTable } from "@/app/(protected)/(admin)/users/table/data-table";
import React from "react";

const page = () => {
  const data: User[] = [
    {
      id: "1a2b3c4d",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      role: "admin",
    },
    {
      id: "9f8e7d6c",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "user",
    },
    {
      id: "5e4f3g2h",
      name: "Carol Taylor",
      email: "carol.taylor@example.com",
      role: "admin",
    },
    {
      id: "6y7t8u9i",
      name: "David Lee",
      email: "david.lee@example.com",
      role: "user",
    },
    {
      id: "4r3e2w1q",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "admin",
    },
    {
      id: "5v6b7n8m",
      name: "Frank Wilson",
      email: "frank.wilson@example.com",
      role: "user",
    },
    {
      id: "7u8i9o0p",
      name: "Grace Martinez",
      email: "grace.martinez@example.com",
      role: "admin",
    },
    {
      id: "3c4v5b6n",
      name: "Henry Brown",
      email: "henry.brown@example.com",
      role: "user",
    },
    {
      id: "8y7t6r5e",
      name: "Ivy Clark",
      email: "ivy.clark@example.com",
      role: "admin",
    },
    {
      id: "2q3w4e5r",
      name: "Jack White",
      email: "jack.white@example.com",
      role: "user",
    },
    {
      id: "1z2x3c4v",
      name: "Karen Green",
      email: "karen.green@example.com",
      role: "admin",
    },
    {
      id: "9m8n7b6v",
      name: "Leo Wright",
      email: "leo.wright@example.com",
      role: "user",
    },
    {
      id: "6b5v4c3x",
      name: "Mia Hall",
      email: "mia.hall@example.com",
      role: "admin",
    },
    {
      id: "5r4e3w2q",
      name: "Nathan Scott",
      email: "nathan.scott@example.com",
      role: "user",
    },
    {
      id: "3e2w1q4r",
      name: "Olivia King",
      email: "olivia.king@example.com",
      role: "admin",
    },
    {
      id: "7t8y9u0i",
      name: "Paul Adams",
      email: "paul.adams@example.com",
      role: "user",
    },
    {
      id: "1q2w3e4r",
      name: "Quinn Brooks",
      email: "quinn.brooks@example.com",
      role: "admin",
    },
    {
      id: "8n7b6v5c",
      name: "Rachel Gray",
      email: "rachel.gray@example.com",
      role: "user",
    },
    {
      id: "4x3c2z1a",
      name: "Samuel Baker",
      email: "samuel.baker@example.com",
      role: "admin",
    },
  ];
  return (

      <DataTable columns={columns} data={data} />

  );
};

export default page;
