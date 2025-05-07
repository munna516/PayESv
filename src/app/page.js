import About from "@/components/About/About";
import FaqSection from "@/components/FaqSection/FaqSection";
import Features from "@/components/Features/Features";
import GetTouch from "@/components/GetTouch/GetTouch";
import Hero from "@/components/Hero/Hero";
import Pricing from "@/components/Pricing/Pricing";
import SupportedPlatforms from "@/components/SupportedPlatforms/SupportedPlatforms";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <About />
      <Features />
      <WhyChooseUs />
      <Pricing />
      <SupportedPlatforms />
      <FaqSection />
      <GetTouch />
    </div>
  );
}
