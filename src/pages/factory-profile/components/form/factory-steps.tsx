import type { SchemaStep } from "@/components/form";
import type { FactoryProfileFormValues } from "@/features/factory";
import { ActivitySection } from "./ActivitySection";
import { BasicInfoSection } from "./BasicInfoSection";
import { CertificationsSection } from "./CertificationsSection";
import { ImagesSection } from "./ImagesSection";
import { LocationSection } from "./LocationSection";
import { RepresentativeSection } from "./RepresentativeSection";
import { ReviewSection } from "./ReviewSection";

export const FACTORY_STEPS: SchemaStep<FactoryProfileFormValues>[] = [
  {
    id: "general",
    title: "Thông tin chung",
    description: "Cơ sở & người đại diện",
    fields: [
      "logoUrl",
      "name",
      "organizationTypeId",
      "taxCode",
      "foundedYear",
      "representativeName",
      "representativeGender",
      "representativePhone",
      "representativeEmail",
    ],
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
    description: "Địa chỉ & toạ độ",
    fields: ["address", "province", "ward", "latitude", "longitude"],
    content: <LocationSection />,
  },
  {
    id: "activity",
    title: "Hoạt động",
    description: "Nông sản & dịch vụ",
    fields: ["productGroupIds", "processingServiceIds", "description"],
    content: <ActivitySection />,
  },
  {
    id: "certifications",
    title: "Chứng nhận & ảnh",
    description: "Chứng nhận, hình ảnh",
    fields: ["hasCertificates", "certificates", "images"],
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
    description: "Kiểm tra & Gửi duyệt",
    fields: [],
    content: <ReviewSection />,
  },
];
