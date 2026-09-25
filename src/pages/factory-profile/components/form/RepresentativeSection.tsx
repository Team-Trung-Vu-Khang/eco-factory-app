import { FormSection, SelectField, TextField } from "@/components/form";
import { GENDER_OPTIONS } from "@/features/factory";
import { useFactoryFormContext } from "./useFactoryFormContext";

export function RepresentativeSection() {
  const { control } = useFactoryFormContext();

  return (
    <FormSection title="Người đại diện">
      <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
        <TextField control={control} name="representative.fullName" label="Họ và tên" required />
        <SelectField control={control} name="representative.gender" label="Giới tính" required options={GENDER_OPTIONS} />
        <TextField control={control} name="representative.phone" label="Số điện thoại" type="tel" required />
        <TextField control={control} name="representative.email" label="Email" type="email" />
      </div>
    </FormSection>
  );
}
