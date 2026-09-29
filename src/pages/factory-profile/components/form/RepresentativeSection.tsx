import { FormSection, SelectField, TextField } from "@/components/form";
import { GENDER_OPTIONS } from "@/features/factory";
import { useFactoryFormContext } from "./useFactoryFormContext";

export function RepresentativeSection() {
  const { control } = useFactoryFormContext();

  return (
    <FormSection title="Người đại diện">
      <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
        <TextField
          control={control}
          name="representativeName"
          label="Họ và tên"
          required
        />
        <SelectField
          control={control}
          name="representativeGender"
          label="Giới tính"
          required
          options={GENDER_OPTIONS}
        />
        <TextField
          control={control}
          name="representativePhone"
          label="Số điện thoại"
          type="tel"
          required
          placeholder="VD: 0912345678"
        />
        <TextField
          control={control}
          name="representativeEmail"
          label="Email"
          type="email"
          placeholder="VD: dai_dien@gmail.com"
        />
      </div>
    </FormSection>
  );
}
