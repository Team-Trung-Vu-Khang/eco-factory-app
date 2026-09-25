import type { SchemaStep } from "@/components/form";
import type { FactoryFormValues } from "@/features/factory";
import { ActivitySection } from "./ActivitySection";
import { BasicInfoSection } from "./BasicInfoSection";
import { CertificationsSection } from "./CertificationsSection";
import { ImagesSection } from "./ImagesSection";
import { LocationSection } from "./LocationSection";
import { MachinesSection } from "./MachinesSection";
import { RepresentativeSection } from "./RepresentativeSection";
import { ReviewSection } from "./ReviewSection";

export const FACTORY_STEPS: SchemaStep<FactoryFormValues>[] = [
  {
    id: "general",
    title: "Thông tin chung",
    description: "Cơ sở & người đại diện",
    fields: ["avatarUrl", "name", "organizationType", "taxCode", "foundedYear", "representative"],
    content: (
      <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
        <BasicInfoSection />
        <RepresentativeSection />
      </div>
    ),
  },
  {
    id: "location",
    title: "Địa điểm",
    description: "Tỉnh, xã, địa chỉ, toạ độ",
    fields: ["location"],
    content: <LocationSection />,
  },
  {
    id: "activity",
    title: "Hoạt động",
    description: "Nông sản & dịch vụ",
    fields: ["productGroupIds", "services", "description"],
    content: <ActivitySection />,
  },
  {
    id: "machines",
    title: "Máy móc",
    description: "Công suất khả dụng",
    fields: ["offersExternalCapacity", "machines"],
    content: <MachinesSection />,
  },
  {
    id: "certifications",
    title: "Chứng nhận & ảnh",
    description: "Chứng nhận, hình ảnh",
    fields: ["hasCertification", "certifications", "facilityPhotos", "machinePhotos"],
    content: (
      <div className="space-y-8">
        <CertificationsSection />
        <ImagesSection />
      </div>
    ),
  },
  {
    id: "review",
    title: "Xác nhận",
    description: "Kiểm tra trước khi lưu",
    fields: [],
    content: <ReviewSection />,
  },
];
