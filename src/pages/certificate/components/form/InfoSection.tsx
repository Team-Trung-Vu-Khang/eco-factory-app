import { FormSection, TextField } from "@/components/form";
import { useCertificateFormContext } from "./useCertificateFormContext";

export function InfoSection() {
  const { control } = useCertificateFormContext();

  return (
    <FormSection title="Thông tin chứng nhận">
      <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        <TextField
          control={control}
          name="certificateType"
          label="Loại chứng nhận"
          required
          placeholder="VD: ATTP, HACCP, ISO 22000, VietGAP..."
          className="sm:col-span-2"
        />
        <TextField
          control={control}
          name="certificateNumber"
          label="Số chứng nhận"
          placeholder="VD: ATTP-2024-001"
          className="sm:col-span-2"
        />
        <TextField
          control={control}
          name="issuer"
          label="Đơn vị cấp"
          placeholder="VD: Sở Nông nghiệp và Môi trường..."
          className="sm:col-span-2"
        />
        <TextField
          control={control}
          name="issuedDate"
          label="Ngày cấp"
          type="date"
        />
        <TextField
          control={control}
          name="expiryDate"
          label="Ngày hết hạn"
          type="date"
          description="Để trống nếu không thời hạn"
        />
      </div>
    </FormSection>
  );
}
