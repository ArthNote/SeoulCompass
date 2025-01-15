import "@/app/globals.css";
import AuthNavBar from "@/components/wrappers/authbar/navbar";
import { SignedIn } from "@clerk/nextjs";

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SignedIn>
      <AuthNavBar />
      <main className="flex min-w-screen h-full flex-col pt-[4rem] items-center bg-background justify-between md:px-16 lg:px-24 xl:px-36 2xl:px-64 px-6">
        <div className="absolute z-[-99] pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        {children}
      </main>
    </SignedIn>
  );
}
