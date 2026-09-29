import {
  AsyncSearchSelectField,
  FormSection,
  ImageUploadField,
  NumberField,
  TextField,
  useUploadStatus,
} from "@/components/form";
import { fetchOrganizationTypeOptions } from "@/features/factory";
import { useFactoryFormContext } from "./useFactoryFormContext";

export function BasicInfoSection() {
  const { control } = useFactoryFormContext();
  const { track } = useUploadStatus();

  return (
    <FormSection title="Thông tin cơ bản">
      <div className="space-y-3">
        <div className="flex flex-col gap-4 sm:flex-row">
          <ImageUploadField
            control={control}
            name="logoUrl"
            label="Logo / ảnh đại diện"
            variant="avatar"
            folder="factory"
            maxFiles={1}
            onUploadingChange={track}
            className="shrink-0"
          />
          <div className="grid flex-1 content-start gap-y-3">
            <TextField
              control={control}
              name="name"
              label="Tên cơ sở / nhà máy"
              required
              placeholder="Tên hiển thị trên MEVI Factories"
            />
            <AsyncSearchSelectField
              control={control}
              name="organizationTypeId"
              label="Loại hình"
              required
              fetchOptions={fetchOrganizationTypeOptions}
              placeholder="Tìm kiếm loại hình..."
            />
          </div>
        </div>
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
          <TextField control={control} name="taxCode" label="Mã số thuế" />
          <NumberField
            control={control}
            name="foundedYear"
            label="Năm thành lập"
            placeholder="VD: 2018"
          />
        </div>
      </div>
    </FormSection>
  );
}
