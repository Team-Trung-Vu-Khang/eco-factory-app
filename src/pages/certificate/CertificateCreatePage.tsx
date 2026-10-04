import { useIsMobile, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Redirect, useLocation } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { useIsFactoryAdmin } from "@/features/viewer";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import {
  EMPTY_CERTIFICATE,
  useCreateCertificate,
  type CertificateFormValues,
} from "@/features/certificate";
import { CertificateStepperForm } from "./components/form/CertificateStepperForm";

export default function CertificateCreatePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const createCertificate = useCreateCertificate();
  const isAdmin = useIsFactoryAdmin();
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();
  const mobileApp = isMobile && mobileUiMode === "app";

  const handleSubmit = async (values: CertificateFormValues) => {
    try {
      const created = await createCertificate.mutateAsync(values);
      toast({ title: "Thành công", description: "Đã thêm chứng nhận." });
      navigate(ROUTES.certificateDetail(String(created.id)));
    } catch (error) {
      toast({
        title: "Không thể lưu",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // Admin has no create API
  if (isAdmin) return <Redirect to={ROUTES.certificates} replace />;

  const form = (
    <CertificateStepperForm
      title="Thêm chứng nhận"
      defaultValues={EMPTY_CERTIFICATE}
      submitLabel="Lưu chứng nhận"
      isSubmitting={createCertificate.isPending}
      onSubmit={handleSubmit}
      onCancel={() => navigate(ROUTES.certificates)}
    />
  );

  // Mobile app: the form brings its own banner/title — no PageWrapper header or padding
  if (mobileApp) return form;

  return (
    <PageWrapper
      title="Thêm chứng nhận"
      description="Khai báo chứng nhận sản xuất của nhà máy"
      overflow="visible"
      actions={<BackButton to={ROUTES.certificates} />}
    >
      {form}
    </PageWrapper>
  );
}
