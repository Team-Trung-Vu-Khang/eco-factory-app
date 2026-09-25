import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Pencil } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import { DetailPageSkeleton, NotFoundState } from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { toCertificateFormValues, useCertificate } from "@/features/certificate";
import { CertificateInfo } from "./components/CertificateInfo";

export default function CertificateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: certificate, isLoading, isError } = useCertificate(id);

  return (
    <PageWrapper
      title={certificate ? certificate.standardName || certificate.number : "Chi tiết chứng nhận"}
      description={certificate?.number}
      actions={
        <>
          <BackButton to={ROUTES.certificates} label="Danh sách" />
          {certificate && (
            <Button onClick={() => navigate(ROUTES.certificateEdit(certificate.id))}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </>
      }
    >
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !certificate ? (
        <NotFoundState message="Không tìm thấy chứng nhận hoặc đã bị xóa." onBack={() => navigate(ROUTES.certificates)} />
      ) : (
        <CertificateInfo values={toCertificateFormValues(certificate)} />
      )}
    </PageWrapper>
  );
}
