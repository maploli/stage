import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ProfilesSection } from "@/components/home/ProfilesSection";
import { ProgramSection } from "@/components/home/ProgramSection";
import { ZonesSection } from "@/components/home/ZonesSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ProfilesSection />
      <ProgramSection />
      <ZonesSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
