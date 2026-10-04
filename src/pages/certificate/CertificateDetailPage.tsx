import { Button, useIsMobile } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Pencil } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import {
  DetailPageSkeleton,
  NotFoundState,
} from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { useCertificate } from "@/features/certificate";
import { useIsFactoryAdmin } from "@/features/viewer";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import { CertificateDetailView } from "./components/CertificateDetailView";
import { MobileCertificateDetail } from "./components/MobileCertificateDetail";

export default function CertificateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: certificate, isLoading, isError } = useCertificate(id);
  const isAdmin = useIsFactoryAdmin();
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();

  if (isMobile && mobileUiMode === "app" && certificate)
    return (
      <MobileCertificateDetail
        certificate={certificate}
        canEdit={!isAdmin}
        canDelete
      />
    );

  return (
    <PageWrapper>
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !certificate ? (
        <NotFoundState
          message="Không tìm thấy chứng nhận hoặc đã bị xóa."
          onBack={() => navigate(ROUTES.certificates)}
        />
      ) : (
        <CertificateDetailView
          certificate={certificate}
          actions={
            <>
              <BackButton to={ROUTES.certificates} label="Quay lại" />
              {!isAdmin && (
                <Button
                  onClick={() =>
                    navigate(ROUTES.certificateEdit(String(certificate.id)))
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
              )}
            </>
          }
        />
      )}
    </PageWrapper>
  );
}
