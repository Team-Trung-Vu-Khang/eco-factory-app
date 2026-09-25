import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { EMPTY_CERTIFICATE, useCreateCertificate, type CertificateFormValues } from "@/features/certificate";
import { CertificateStepperForm } from "./components/form/CertificateStepperForm";

export default function CertificateCreatePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const createCertificate = useCreateCertificate();

  const handleSubmit = async (values: CertificateFormValues) => {
    try {
      const created = await createCertificate.mutateAsync(values);
      toast({ title: "Thành công", description: "Đã thêm chứng nhận." });
      navigate(ROUTES.certificateDetail(created.id));
    } catch (error) {
      toast({ title: "Không thể lưu", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper
      title="Thêm chứng nhận"
      description="Khai báo chứng nhận sản xuất của nhà máy"
      overflow="visible"
      actions={<BackButton to={ROUTES.certificates} />}
    >
      <CertificateStepperForm
        defaultValues={EMPTY_CERTIFICATE}
        submitLabel="Lưu chứng nhận"
        isSubmitting={createCertificate.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.certificates)}
      />
    </PageWrapper>
  );
}
