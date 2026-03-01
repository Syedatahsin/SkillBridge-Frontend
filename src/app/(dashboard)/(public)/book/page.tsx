import { Toaster } from "sonner";
import StudentBookingPage from '../../../../components/bookingslotspreview';

export default function BookPage() {
  return (
    <>
      {/* The Toaster can stay here or be moved to your layout.tsx */}
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
        <h1 className="text-2xl font-bold mb-6">Book Your Session</h1>
        <StudentBookingPage />
      </div>
    </>
  );
}