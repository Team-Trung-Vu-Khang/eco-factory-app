import { FormSection, ImageUploadField, TextareaField, useUploadStatus } from "@/components/form";
import { useCertificateFormContext } from "./useCertificateFormContext";

export function DocumentsSection() {
  const { control } = useCertificateFormContext();
  const { track } = useUploadStatus();

  return (
    <FormSection title="Tài liệu" description="Ảnh chụp hoặc bản scan PDF của giấy chứng nhận — dùng làm bằng chứng">
      <div className="space-y-4">
        <ImageUploadField
          control={control}
          name="files"
          label="Ảnh / file chứng nhận"
          required
          maxFiles={5}
          allowPdf
          folder="certificates"
          onUploadingChange={track}
        />
        <TextareaField control={control} name="note" label="Ghi chú" rows={2} />
      </div>
    </FormSection>
  );
}
