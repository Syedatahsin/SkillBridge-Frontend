import { Toaster } from "sonner";
import StudentBookingPage from '../../../../components/bookingslotspreview';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* THE MISSING PIECE: This component actually draws the toast on screen */}
      <Toaster 
        theme="dark" 
        richColors 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#0A0A0B',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <StudentBookingPage/>
        {children}
      </div>
    </>
  );
}