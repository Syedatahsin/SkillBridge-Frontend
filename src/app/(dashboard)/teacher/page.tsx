import { getTutorSessionAction } from "@/Serveraction/slot";
import Footer from "@/components/Footer";
import TeacherOnboardingCard from "@/components/profileTeacher";
import { ReviewSection } from "@/components/review";
import SessionManagement from "@/components/sessionglasscard";
export const dynamic = "force-dynamic";

export default async function Page() {
  // 1. Call your existing Server Action
  const res = await getTutorSessionAction();
  
  // 2. Determine if the tutor exists
  const hasTutorProfile = res.success && res.tutorId;
console.log("Tutor Session Data:", res); // Debug log to check the response structure

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
            <header className="py-6 border-b border-white/5">
              <h1 className="text-3xl font-black italic text-purple-500 uppercase">
                Teacher Console
              </h1>
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