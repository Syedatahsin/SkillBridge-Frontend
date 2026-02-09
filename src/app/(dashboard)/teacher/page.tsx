import Footer from "@/components/Footer"
import { ReviewSection } from "@/components/review"
import SessionManagement from "@/components/sessionglasscard"   
const page = () => {
  return (
<div className="min-h-screen bg-gray-900 text-white p-5">
    <SessionManagement role="teacher"/>
    <ReviewSection/>
    <Footer/>
    
  </div>
)    }                      

export default page