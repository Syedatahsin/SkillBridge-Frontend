import Footer from "@/components/Footer"
import StudentWelcome from "@/components/StudentgreetingSection"
import SessionManagement from "@/components/sessionglasscard"
import CategorySection from "@/components/CategoriesCard";

const page = () => {
  return (
<div className="min-h-screen bg-gray-900 text-white p-5">
    <StudentWelcome/>
        <SessionManagement role="student"/>
        <CategorySection role="student"/>
        
        <Footer/>

  </div>  )
}

export default page