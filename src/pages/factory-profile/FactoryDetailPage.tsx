import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Pencil } from "lucide-react";
import { useLocation, useParams } from "wouter";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { useFactory } from "@/features/factory";
import { CertificationListSection } from "./components/detail/CertificationListSection";
import { FactoryInfoSections } from "./components/detail/FactoryInfoSections";
import { FactorySummaryCard } from "./components/detail/FactorySummaryCard";
import { MachineListSection } from "./components/detail/MachineListSection";
import { PhotoGallerySection } from "./components/detail/PhotoGallerySection";
import { FactoryNotFound, FactoryPageSkeleton } from "./components/FactoryPageState";

export default function FactoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: factory, isLoading, isError } = useFactory(id);
  const goBack = () => navigate(ROUTES.profile);

  return (
    <PageWrapper
      title="Chi tiết nhà máy"
      actions={
        <>
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Danh sách
          </Button>
          {factory && (
            <Button onClick={() => navigate(ROUTES.profileEdit(factory.id))}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </>
      }
    >
      {isLoading ? (
        <FactoryPageSkeleton />
      ) : isError || !factory ? (
        <FactoryNotFound onBack={goBack} />
      ) : (
        <div className="space-y-6">
          <FactorySummaryCard factory={factory} />
          <FactoryInfoSections factory={factory} />
          <MachineListSection factory={factory} />
          <CertificationListSection factory={factory} />
          <PhotoGallerySection factory={factory} />
        </div>
      )}
    </PageWrapper>
  );
}
