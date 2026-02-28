import ReviewForm from "@/components/ReviewForm"; // Update path accordingly
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const ReviewPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-5 pt-20">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-purple-600" />
        </div>
      }>
        <ReviewForm />
      </Suspense>
    </div>
  );
};

export default ReviewPage;