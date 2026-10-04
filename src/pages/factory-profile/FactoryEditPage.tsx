import { useIsMobile, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import {
  DetailPageSkeleton,
  NotFoundState,
} from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import {
  fromFactoryProfileToFormValues,
  toFactoryProfileSubmitInput,
  useAdminFactoryProfile,
  useMyFactoryProfile,
  useSubmitFactoryProfile,
  type FactoryProfileFormValues,
} from "@/features/factory";
import { useIsFactoryMember } from "@/features/viewer";
import { FactoryStepperForm } from "./components/form/FactoryStepperForm";

export default function FactoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();
  const mobileApp = isMobile && mobileUiMode === "app";
  const isMember = useIsFactoryMember();

  // Member gets own profile via /api/factory/profile; Admin gets via /api/admin/factory/profiles/:id
  const myProfileQuery = useMyFactoryProfile();
  const adminProfileQuery = useAdminFactoryProfile(isMember ? undefined : id);

  const profile = isMember ? myProfileQuery.data : adminProfileQuery.data;
  const isLoading = isMember
    ? myProfileQuery.isLoading
    : adminProfileQuery.isLoading;
  const isError = isMember ? myProfileQuery.isError : adminProfileQuery.isError;

  const submitProfile = useSubmitFactoryProfile();
  const backTo = isMember ? ROUTES.profile : ROUTES.profileDetail(id);

  const handleSubmit = async (values: FactoryProfileFormValues) => {
    try {
      const payload = toFactoryProfileSubmitInput(values);
      await submitProfile.mutateAsync(payload);
      toast({
        title: "Đã gửi hồ sơ",
        description: "Hồ sơ nhà máy đã được gửi và đang chờ duyệt.",
      });
      navigate(backTo);
    } catch (error) {
      toast({
        title: "Không thể lưu",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const form = profile && (
    <FactoryStepperForm
      title="Chỉnh sửa hồ sơ"
      key={String(profile.id)}
      defaultValues={fromFactoryProfileToFormValues(profile)}
      submitLabel="Gửi duyệt hồ sơ"
      isSubmitting={submitProfile.isPending}
      onSubmit={handleSubmit}
      onCancel={() => navigate(backTo)}
    />
  );

  // Mobile app: the form brings its own banner/title — no PageWrapper header or padding
  if (mobileApp && form) return form;

  return (
    <PageWrapper
      title="Chỉnh sửa hồ sơ nhà máy"
      description={profile?.name}
      overflow="visible"
      actions={<BackButton to={backTo} />}
    >
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !profile ? (
        <NotFoundState
          message="Không tìm thấy hồ sơ nhà máy hoặc chưa được tạo."
          onBack={() => navigate(ROUTES.profile)}
        />
      ) : (
        form
      )}
    </PageWrapper>
  );
}
