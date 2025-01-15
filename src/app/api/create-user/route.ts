import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const client = await clerkClient();

    const user = await client.users.createUser({
      emailAddress: [email],
      password: password,
      username: username,
    });

    const id = user.id;
    return NextResponse.json({ message: "User created", clerkId: id });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ message: error.message });
  }
}
