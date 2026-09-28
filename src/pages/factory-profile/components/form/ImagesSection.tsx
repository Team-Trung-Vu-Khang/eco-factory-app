import { FormSection, ImageUploadField, useUploadStatus } from "@/components/form";
import { useFactoryFormContext } from "./useFactoryFormContext";

const FOLDER = "factory";

export function ImagesSection() {
  const { control } = useFactoryFormContext();
  const { track } = useUploadStatus();

  return (
    <FormSection title="Hình ảnh" description="Ảnh thực tế giúp hồ sơ đáng tin cậy hơn">
      <ImageUploadField control={control} name="machinePhotos" label="Ảnh máy móc / dây chuyền" maxFiles={10} folder={FOLDER} onUploadingChange={track} />
    </FormSection>
  );
}
