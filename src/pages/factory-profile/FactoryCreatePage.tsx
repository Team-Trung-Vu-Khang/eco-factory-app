import { useIsMobile, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import {
  EMPTY_FACTORY_PROFILE,
  toFactoryProfileSubmitInput,
  useSubmitFactoryProfile,
  type FactoryProfileFormValues,
} from "@/features/factory";
import { FactoryStepperForm } from "./components/form/FactoryStepperForm";

export default function FactoryCreatePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();
  const mobileApp = isMobile && mobileUiMode === "app";
  const submitProfile = useSubmitFactoryProfile();

  const handleSubmit = async (values: FactoryProfileFormValues) => {
    try {
      const payload = toFactoryProfileSubmitInput(values);
      await submitProfile.mutateAsync(payload);
      toast({
        title: "Đã gửi hồ sơ",
        description: "Hồ sơ nhà máy đã được gửi và đang chờ duyệt.",
      });
      navigate(ROUTES.profile);
    } catch (error) {
      toast({
        title: "Không thể gửi hồ sơ",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const form = (
    <FactoryStepperForm
      title="Thiết lập hồ sơ nhà máy"
      defaultValues={EMPTY_FACTORY_PROFILE}
      submitLabel="Gửi duyệt hồ sơ"
      isSubmitting={submitProfile.isPending}
      onSubmit={handleSubmit}
      onCancel={() => navigate(ROUTES.profile)}
    />
  );

  // Mobile app: the form brings its own banner/title — no PageWrapper header or padding
  if (mobileApp) return form;

  return (
    <PageWrapper
      title="Thiết lập hồ sơ nhà máy"
      description="Khai báo thông tin cơ sở chế biến trên MEVI Factories"
      overflow="visible"
      actions={<BackButton to={ROUTES.profile} />}
    >
      {form}
    </PageWrapper>
  );
}
