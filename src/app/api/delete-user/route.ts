import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error deleting user" });
  }
}
