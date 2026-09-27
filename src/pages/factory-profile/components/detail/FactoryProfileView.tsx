import type { Factory } from "@/features/factory";
import { ApprovalNotice } from "./ApprovalNotice";
import { CertificationListSection } from "./CertificationListSection";
import { FactoryInfoSections } from "./FactoryInfoSections";
import { FactorySummaryCard } from "./FactorySummaryCard";
import { MachineListSection } from "./MachineListSection";
import { PhotoGallerySection } from "./PhotoGallerySection";

/** Full profile — admin detail page and the factory member's own profile */
export function FactoryProfileView({ factory, isOwner, onEdit }: { factory: Factory; isOwner?: boolean; onEdit?: () => void }) {
  return (
    <div className="space-y-6">
      <ApprovalNotice factory={factory} isOwner={isOwner} />
      <FactorySummaryCard factory={factory} onEdit={onEdit} />
      <FactoryInfoSections factory={factory} />
      <MachineListSection factory={factory} />
      <CertificationListSection factory={factory} />
      <PhotoGallerySection factory={factory} />
    </div>
  );
}
