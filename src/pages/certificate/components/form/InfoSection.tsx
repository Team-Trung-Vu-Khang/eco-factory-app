import { FormSection, SearchSelectField, SelectField, TextField } from "@/components/form";
import { CERTIFICATION_ISSUER_OPTIONS, CERTIFICATION_TYPE_OPTIONS } from "@/features/factory";
import { useCertificateFormContext } from "./useCertificateFormContext";

export function InfoSection() {
  const { control } = useCertificateFormContext();

  return (
    <FormSection title="Thông tin chứng nhận">
      <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        <SelectField control={control} name="type" label="Loại chứng nhận" required options={CERTIFICATION_TYPE_OPTIONS} />
        <TextField control={control} name="standardName" label="Tên / tiêu chuẩn" placeholder="VD: ISO 22000:2018" />
        <TextField control={control} name="number" label="Số chứng nhận" required />
        <SearchSelectField control={control} name="issuer" label="Đơn vị cấp" required options={CERTIFICATION_ISSUER_OPTIONS} placeholder="Tìm đơn vị cấp..." />
        <TextField control={control} name="issuedDate" label="Ngày cấp" type="date" required />
        <TextField control={control} name="expiryDate" label="Ngày hết hạn" type="date" description="Để trống nếu không thời hạn" />
      </div>
    </FormSection>
  );
}
