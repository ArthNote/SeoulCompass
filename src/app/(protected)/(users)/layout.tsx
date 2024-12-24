import '@/app/globals.css';

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <div>{children}</div>

  );
}
