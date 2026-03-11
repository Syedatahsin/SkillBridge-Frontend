import { getTutorSessionAction } from "@/Serveraction/slot";
import Footer from "@/components/Footer";
import TeacherOnboardingCard from "@/components/profileTeacher";
import { ReviewSection } from "@/components/review";
import SessionManagement from "@/components/sessionglasscard";
import Link from "next/link"; // Import Link
import { Plus } from "lucide-react"; // Optional: icon for extra flair

export const dynamic = "force-dynamic";

export default async function Page() {
  // 1. Call your existing Server Action
  const res = await getTutorSessionAction();
  
  // 2. Determine if the tutor exists
  const hasTutorProfile = res.success && res.tutorId;
  console.log("Tutor Session Data:", res); 

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <div className="max-w-7xl mx-auto">
        {!hasTutorProfile ? (
          /* Show Onboarding if no tutorId found */
          <div className="py-20 flex justify-center">
            <TeacherOnboardingCard />
          </div>
        ) : (
          /* Show Dashboard if tutorId exists */
          <div className="space-y-10">
            <header className="py-6 border-b border-white/5 flex justify-between items-center">
              <h1 className="text-3xl font-black italic text-purple-500 uppercase">
                Teacher Console
              </h1>

              {/* Attractive Add Schedule Button */}
              <Link 
                href="/teacher/slotcreation" 
                className="group relative inline-flex items-center gap-2 px-6 py-3 font-bold text-white transition-all duration-300 bg-purple-600 rounded-xl hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Add Schedule</span>
                <div className="absolute inset-0 rounded-xl border-2 border-white/20 group-hover:border-white/40 transition-colors" />
              </Link>
            </header>

            <SessionManagement role="teacher" userId={res.tutorId} />
            
            <ReviewSection userId={res.tutorId} />
          </div>
        )}
        
        <Footer />
      </div>
    </div>
  );
}