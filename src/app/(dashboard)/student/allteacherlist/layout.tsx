

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="container mx-auto px-5 py-8">
        {children}
      </div>
    </>
  );
}