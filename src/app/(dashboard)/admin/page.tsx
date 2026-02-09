import CategorySection from "@/components/CategoriesCard"
import AdminManagementTabs from "@/components/previewAdmin"
import Footer from '../../../components/Footer';

const page = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
<CategorySection role="admin"/>
<AdminManagementTabs/>
<Footer/>

</div>
  )
}

export default page