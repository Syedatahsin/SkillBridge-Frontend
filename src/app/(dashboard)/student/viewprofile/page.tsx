import UnifiedProfile from "@/components/viewallprofile"
import { userService } from "@/Serveraction/cookiesaction";
export const dynamic = "force-dynamic";
const page = async () => {
    // 2. Fetch the session
      const { data: session } = await userService.getSession();
    const studentId = session|| null;
  return (
<div className="min-h-screen bg-gray-900 text-white p-5">
<UnifiedProfile role="student" userId={studentId?.user?.id || null} />
  </div>  )
}

export default page 
