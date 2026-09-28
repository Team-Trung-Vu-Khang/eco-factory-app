import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Pencil } from "lucide-react";
import { useLocation } from "wouter";
import { DetailPageSkeleton, NotFoundState } from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { useCurrentFactory, useFactory } from "@/features/factory";
import { FactoryProfileView } from "./components/detail/FactoryProfileView";

/** MEVI_FACTORY_MEMBER: "Hồ sơ nhà máy" is their own factory, not the list */
export default function MyFactoryProfilePage() {
  const [, navigate] = useLocation();
  const { factoryId } = useCurrentFactory();
  const { data: factory, isLoading, isError } = useFactory(factoryId);

  return (
    <PageWrapper>
      {!factoryId || isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !factory ? (
        <NotFoundState message="Tài khoản chưa được gán nhà máy." />
      ) : (
        <FactoryProfileView
          factory={factory}
          isOwner
          actions={
            <Button onClick={() => navigate(ROUTES.profileEdit(factory.id))}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          }
        />
      )}
    </PageWrapper>
  );
}
