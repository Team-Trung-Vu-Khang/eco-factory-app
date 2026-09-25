import {
  FormSection,
  ImageUploadField,
  NumberField,
  SelectField,
  TextField,
  useUploadStatus,
} from "@/components/form";
import { ORGANIZATION_TYPE_OPTIONS } from "@/features/factory";
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
            name="avatarUrl"
            label="Logo / ảnh"
            variant="avatar"
            folder="factory"
            onUploadingChange={track}
            className="shrink-0"
          />
          <div className="grid flex-1 content-start gap-y-3">
            <TextField control={control} name="name" label="Tên cơ sở / nhà máy" required placeholder="Tên hiển thị trên MEVI Factories" />
            <SelectField control={control} name="organizationType" label="Loại hình" required options={ORGANIZATION_TYPE_OPTIONS} />
          </div>
        </div>
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
          <TextField control={control} name="taxCode" label="Mã số thuế" />
          <NumberField control={control} name="foundedYear" label="Năm thành lập" placeholder="VD: 2018" />
        </div>
      </div>
    </FormSection>
  );
}
