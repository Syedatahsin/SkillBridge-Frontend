import CategorySection from "@/components/CategoriesCard"
import AdminManagementTabs from "@/components/previewAdmin"
import AdminOverviewCard from "@/components/AdminOverviewCard"
import Footer from '../../../components/Footer';

const page = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-5 space-y-16 transition-colors duration-300">
      <section id="overview">
        <AdminOverviewCard />
      </section>
      
      <section id="categories">
        <CategorySection role="admin"/>
      </section>
      
      <section id="management">
        <AdminManagementTabs/>
      </section>
      
      <Footer/>
    </div>
  )
}

export default page