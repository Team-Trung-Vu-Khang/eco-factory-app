import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useWatch } from "react-hook-form";
import { FormSection, SearchSelectField, SelectField, SwitchField, TextField } from "@/components/form";
import { CERTIFICATION_ISSUER_OPTIONS, CERTIFICATION_TYPE_OPTIONS, EMPTY_CERTIFICATION } from "@/features/factory";
import { useFactoryFormContext } from "./useFactoryFormContext";

export function CertificationsSection() {
  const { control } = useFactoryFormContext();
  const { fields, append, remove, replace } = useFieldArray({ control, name: "certifications" });
  const hasCertification = useWatch({ control, name: "hasCertification" });

  return (
    <FormSection title="Chứng nhận">
      <div className="space-y-4">
        <SwitchField control={control} name="hasCertification" label="Cơ sở có chứng nhận" description="ATTP, HACCP, ISO, GMP…"
          onCheckedChange={(checked) => replace(checked ? [{ ...EMPTY_CERTIFICATION }] : [])}
        />

        {hasCertification && (
          <>
            <div className="space-y-2">
              {fields.map((field, index) => {
                const base = `certifications.${index}` as const;
                return (
                  <div
                    key={field.id}
                    className="grid items-start gap-x-3 gap-y-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto]"
                  >
                    <SelectField control={control} name={`${base}.type`} label="Loại chứng nhận" required options={CERTIFICATION_TYPE_OPTIONS} />
                    <TextField control={control} name={`${base}.number`} label="Số chứng nhận" />
                    <TextField control={control} name={`${base}.issuedDate`} label="Ngày cấp" type="date" />
                    <TextField control={control} name={`${base}.expiryDate`} label="Ngày hết hạn" type="date" />
                    <SearchSelectField control={control} name={`${base}.issuer`} label="Đơn vị cấp" options={CERTIFICATION_ISSUER_OPTIONS} placeholder="Tìm đơn vị cấp..." />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="justify-self-end text-slate-400 hover:text-rose-600 lg:mt-[1.625rem]"
                      aria-label={`Xóa chứng nhận ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <Button type="button" variant="ghost" size="sm" className="text-emerald-700" onClick={() => append({ ...EMPTY_CERTIFICATION })}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm chứng nhận
            </Button>
          </>
        )}
      </div>
    </FormSection>
  );
}
