import { HeroSection } from '../sections/home/HeroSection';
import { AnnouncementBar } from '../sections/home/AnnouncementBar';
import { QuickAccessGrid } from '../sections/home/QuickAccessGrid';
import { InstitutionalOverview } from '../sections/home/InstitutionalOverview';
import { PublicationsFeature } from '../sections/home/PublicationsFeature';
import { ScientificProgrammes } from '../sections/home/ScientificProgrammes';
import { NewsHighlights } from '../sections/home/NewsHighlights';
import { StakeholderForum } from '../sections/home/StakeholderForum';
import { SkillDevelopment } from '../sections/home/SkillDevelopment';
import { InstitutionalGallery } from '../sections/home/InstitutionalGallery';
import { FiguresBand } from '../sections/home/FiguresBand';
import { MonographProcess } from '../sections/home/MonographProcess';
import { usePageSetup } from '../lib/page-context';

export function HomePage() {
  usePageSetup('', 'https://www.ipc.gov.in/hi/');
  return (
    <>
      <HeroSection />
      <AnnouncementBar />
      <FiguresBand />
      <QuickAccessGrid />
      <InstitutionalOverview />
      <PublicationsFeature />
      <MonographProcess />
      <ScientificProgrammes />
      <NewsHighlights />
      <StakeholderForum />
      <SkillDevelopment />
      <InstitutionalGallery />
    </>
  );
}
