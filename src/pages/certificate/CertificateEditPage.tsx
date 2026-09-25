import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import { DetailPageSkeleton, NotFoundState } from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import {
  toCertificateFormValues,
  useUpdateCertificate,
  useCertificate,
  type CertificateFormValues,
} from "@/features/certificate";
import { CertificateStepperForm } from "./components/form/CertificateStepperForm";

export default function CertificateEditPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { data: certificate, isLoading, isError } = useCertificate(id);
  const updateCertificate = useUpdateCertificate();

  const handleSubmit = async (values: CertificateFormValues) => {
    try {
      await updateCertificate.mutateAsync({ id, values });
      toast({ title: "Thành công", description: "Đã cập nhật chứng nhận." });
      navigate(ROUTES.certificateDetail(id));
    } catch (error) {
      toast({ title: "Không thể lưu", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper
      title="Chỉnh sửa chứng nhận"
      description={certificate?.number}
      overflow="visible"
      actions={<BackButton to={ROUTES.certificateDetail(id)} />}
    >
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !certificate ? (
        <NotFoundState message="Không tìm thấy chứng nhận hoặc đã bị xóa." onBack={() => navigate(ROUTES.certificates)} />
      ) : (
        <CertificateStepperForm
          key={certificate.id}
          defaultValues={toCertificateFormValues(certificate)}
          submitLabel="Lưu thay đổi"
          isSubmitting={updateCertificate.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.certificateDetail(id))}
        />
      )}
    </PageWrapper>
  );
}
