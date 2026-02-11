

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // This empty tag is a Fragment. It groups the elements without adding a new div to the DOM.
    <>
      
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </>
  );
}