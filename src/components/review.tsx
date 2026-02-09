import { Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
export const ReviewSection = () => {
  return (
    <div className="mt-16 grid lg:grid-cols-3 gap-8">
      
      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-white/10">
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-gray-400 font-medium">Average Rating</p>
          <h2 className="text-6xl font-black text-white">4.9</h2>
          <div className="flex justify-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
          </div>
          <p className="text-sm text-gray-500">Based on 128 Reviews</p>
          <Button variant="outline" className="w-full rounded-full border-white/10 bg-white/5 hover:bg-white/10">
            See All Ratings
          </Button>
        </CardContent>
      </Card>

      {/* Review List Preview */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Latest Reviews</h2>
          <a href="/teacher/reviews" className="text-purple-400 text-sm hover:underline flex items-center gap-1">
            View All Reviews <ArrowRight size={14} />
          </a>
        </div>

        {[1, 2].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-purple-400">S</div>
                <div>
                  <p className="text-sm font-bold text-white">Student Name</p>
                  <p className="text-[10px] text-gray-500 uppercase">2 days ago</p>
                </div>
              </div>
              <div className="flex gap-0.5 text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              &quot;The teacher was very patient and explained the core concepts of Next.js very clearly. Highly recommended!&quot;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};