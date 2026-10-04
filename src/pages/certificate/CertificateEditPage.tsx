import { useIsMobile, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Redirect, useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import {
  DetailPageSkeleton,
  NotFoundState,
} from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { useIsFactoryAdmin } from "@/features/viewer";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
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
  const isAdmin = useIsFactoryAdmin();
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();
  const mobileApp = isMobile && mobileUiMode === "app";

  const handleSubmit = async (values: CertificateFormValues) => {
    try {
      await updateCertificate.mutateAsync({ id, values });
      toast({ title: "Thành công", description: "Đã cập nhật chứng nhận." });
      navigate(ROUTES.certificateDetail(id));
    } catch (error) {
      toast({
        title: "Không thể lưu",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // Admin has no update API — view only
  if (isAdmin) return <Redirect to={ROUTES.certificateDetail(id)} replace />;

  const form = certificate && (
    <CertificateStepperForm
      title="Chỉnh sửa chứng nhận"
      key={certificate.id}
      defaultValues={toCertificateFormValues(certificate)}
      submitLabel="Lưu thay đổi"
      isSubmitting={updateCertificate.isPending}
      onSubmit={handleSubmit}
      onCancel={() => navigate(ROUTES.certificateDetail(id))}
    />
  );

  // Mobile app: the form brings its own banner/title — no PageWrapper header or padding
  if (mobileApp && form) return form;

  return (
    <PageWrapper
      title="Chỉnh sửa chứng nhận"
      description={certificate?.certificateNumber}
      overflow="visible"
      actions={<BackButton to={ROUTES.certificateDetail(id)} />}
    >
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !certificate ? (
        <NotFoundState
          message="Không tìm thấy chứng nhận hoặc đã bị xóa."
          onBack={() => navigate(ROUTES.certificates)}
        />
      ) : (
        form
      )}
    </PageWrapper>
  );
}
