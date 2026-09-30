import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Pencil } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import { DetailPageSkeleton, NotFoundState } from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { useCertificate } from "@/features/certificate";
import { CertificateDetailView } from "./components/CertificateDetailView";

export default function CertificateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: certificate, isLoading, isError } = useCertificate(id);

  return (
    <PageWrapper>
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !certificate ? (
        <NotFoundState message="Không tìm thấy chứng nhận hoặc đã bị xóa." onBack={() => navigate(ROUTES.certificates)} />
      ) : (
        <CertificateDetailView
          certificate={certificate}
          actions={
            <>
              <BackButton to={ROUTES.certificates} label="Quay lại" />
              <Button onClick={() => navigate(ROUTES.certificateEdit(String(certificate.id)))}>
              <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </>
          }
        />
      )}
    </PageWrapper>
  );
}
