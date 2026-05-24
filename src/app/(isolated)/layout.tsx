// Isolated layout – no header, no footer (used for /login, /register, /interview)
export default function IsolatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
