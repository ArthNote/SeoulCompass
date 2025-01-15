import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const email = searchParams.get("email");
  const id = searchParams.get("clerkId");

  if (!username || !email || !id) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const client = await clerkClient();

    const user = await client.users.getUser(id);
    const emailAddress = user.emailAddresses[0];

    await client.users.updateUser(id, {
      username: username,
    });

    if (emailAddress.emailAddress === user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ message: "User updated noa", updated: true });
    } else {
      await client.emailAddresses.createEmailAddress({
        emailAddress: email,
        userId: id,
        primary: true,
      });
      await client.emailAddresses.deleteEmailAddress(emailAddress.id);
      return NextResponse.json({ message: "User updated aa", updated: true });
    }
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ message: error.message, updated: false });
  }
}
