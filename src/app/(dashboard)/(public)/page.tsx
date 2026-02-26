import CategorySection from "@/components/CategoriesCard";
import FAQSection from "@/components/home/faq";
import Footer from "@/components/Footer";
import Hero1 from "@/components/home/hero1";
import FeaturedDesign from "@/components/product-card1";
const Pge = () => {
  return (
    <div>
        <Hero1/>
<FeaturedDesign/>
<CategorySection role="student"/>
<FAQSection/>
<Footer/>
    </div>
  )
}

export default Pge