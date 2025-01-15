import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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
    const user = await client.users.getUser(userId);
    const role = (await user.publicMetadata.role) as string | undefined;
    return NextResponse.json({ message: "User found", role: role });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error getting user" });
  }
}
