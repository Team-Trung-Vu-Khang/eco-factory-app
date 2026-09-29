import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Pencil, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { DetailPageSkeleton, EmptyState } from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { useMyFactoryProfile } from "@/features/factory";
import { FactoryProfileView } from "./components/detail/FactoryProfileView";

/** MEVI_FACTORY_MEMBER: "Hồ sơ nhà máy" is their own factory */
export default function MyFactoryProfilePage() {
  const [, navigate] = useLocation();
  const { data: profile, isLoading, isError } = useMyFactoryProfile();

  if (isLoading) {
    return (
      <PageWrapper>
        <DetailPageSkeleton />
      </PageWrapper>
    );
  }

  if (isError || !profile) {
    return (
      <PageWrapper
        title="Hồ sơ nhà máy"
        description="Quản lý thông tin cơ sở chế biến trên MEVI Factories"
      >
        <EmptyState
          title="Chưa có hồ sơ nhà máy"
          description="Workspace của bạn chưa hoàn thiện hồ sơ cơ sở chế biến. Hãy tiến hành thiết lập để bắt đầu kết nối."
          action={
            <Button onClick={() => navigate(ROUTES.profileCreate)}>
              <Plus className="mr-2 h-4 w-4" />
              Thiết lập hồ sơ ngay
            </Button>
          }
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <FactoryProfileView
        factory={profile}
        isOwner
        actions={
          <Button
            onClick={() => navigate(ROUTES.profileEdit(String(profile.id)))}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        }
      />
    </PageWrapper>
  );
}
