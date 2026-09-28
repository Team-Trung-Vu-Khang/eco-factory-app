import { Tabs, TabsContent, TabsList, TabsTrigger } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Award, Image, Info, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import type { Factory } from "@/features/factory";
import { ApprovalNotice } from "./ApprovalNotice";
import { CertificationListSection } from "./CertificationListSection";
import { FactoryDetailHeader } from "./FactoryDetailHeader";
import { FactoryOverviewTab } from "./FactoryOverviewTab";
import { MachineListSection } from "./MachineListSection";
import { PhotoGallerySection } from "./PhotoGallerySection";

const TABS = [
  { value: "info", label: "Thông tin", icon: Info },
  { value: "machines", label: "Máy móc", icon: Wrench },
  { value: "certs", label: "Chứng nhận", icon: Award },
  { value: "photos", label: "Hình ảnh", icon: Image },
];

/** Full profile — admin detail page and the factory member's own profile */
export function FactoryProfileView({
  factory,
  isOwner,
  readOnly,
  actions,
}: {
  factory: Factory;
  isOwner?: boolean;
  /** Member viewing another factory */
  readOnly?: boolean;
  actions?: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <FactoryDetailHeader factory={factory} actions={actions} />
      <ApprovalNotice factory={factory} isOwner={isOwner} />
      <Tabs defaultValue="info" className="space-y-6">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1.5">
          <TabsList className="mx-auto flex h-auto w-max gap-1 bg-transparent p-0">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="gap-2 rounded-lg px-4 py-2 text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
              >
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="info" className="mt-0">
          <FactoryOverviewTab factory={factory} />
        </TabsContent>
        <TabsContent value="machines" className="mt-0">
          <MachineListSection factory={factory} readOnly={readOnly} />
        </TabsContent>
        <TabsContent value="certs" className="mt-0">
          <CertificationListSection factory={factory} />
        </TabsContent>
        <TabsContent value="photos" className="mt-0">
          <PhotoGallerySection factory={factory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
