import { HeroCarousel } from '../sections/home/HeroCarousel';
import { NewsHighlights } from '../sections/home/NewsHighlights';
import { QuickAccessGrid } from '../sections/home/QuickAccessGrid';
import { InstitutionalOverview } from '../sections/home/InstitutionalOverview';
import { PublicationsFeature } from '../sections/home/PublicationsFeature';
import { StandardsStory } from '../sections/home/StandardsStory';
import { StakeholderForum } from '../sections/home/StakeholderForum';
import { ScientificProgrammes } from '../sections/home/ScientificProgrammes';
import { SkillDevelopment } from '../sections/home/SkillDevelopment';
import { InstitutionalGallery } from '../sections/home/InstitutionalGallery';
import { ContactBand } from '../sections/home/ContactBand';
import { usePageSetup } from '../lib/page-context';

export function HomePage() {
  usePageSetup('', 'https://www.ipc.gov.in/hi/');
  return (
    <>
      <HeroCarousel />
      <NewsHighlights />
      <QuickAccessGrid />
      <InstitutionalOverview />
      <PublicationsFeature />
      <StandardsStory />
      <StakeholderForum />
      <ScientificProgrammes />
      <SkillDevelopment />
      <InstitutionalGallery />
      <ContactBand />
    </>
  );
}
