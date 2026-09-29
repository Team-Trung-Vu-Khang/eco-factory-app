import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useWatch } from "react-hook-form";
import { FormSection, SwitchField, TextField } from "@/components/form";
import { useFactoryFormContext } from "./useFactoryFormContext";

const EMPTY_PROFILE_CERT = {
  certificateType: "",
  certificateNumber: "",
  issuedDate: "",
  expiryDate: "",
  issuer: "",
  scopeDescription: "",
};

export function CertificationsSection() {
  const { control } = useFactoryFormContext();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "certificates",
  });
  const hasCertificates = useWatch({ control, name: "hasCertificates" });

  return (
    <FormSection title="Chứng nhận sản xuất">
      <div className="space-y-4">
        <SwitchField
          control={control}
          name="hasCertificates"
          label="Cơ sở có chứng nhận"
          description="Bật nếu nhà máy có chứng nhận như ATTP, HACCP, ISO, GMP, VietGAP…"
          onCheckedChange={(checked) =>
            replace(checked ? [{ ...EMPTY_PROFILE_CERT }] : [])
          }
        />

        {hasCertificates && (
          <>
            <div className="space-y-3">
              {fields.map((field, index) => {
                const base = `certificates.${index}` as const;
                return (
                  <div
                    key={field.id}
                    className="grid items-start gap-x-3 gap-y-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto]"
                  >
                    <TextField
                      control={control}
                      name={`${base}.certificateType`}
                      label="Loại chứng nhận"
                      required
                      placeholder="VD: ATTP, ISO 22000..."
                    />
                    <TextField
                      control={control}
                      name={`${base}.certificateNumber`}
                      label="Số chứng nhận"
                      placeholder="VD: ATTP-2024-001"
                    />
                    <TextField
                      control={control}
                      name={`${base}.issuedDate`}
                      label="Ngày cấp"
                      type="date"
                    />
                    <TextField
                      control={control}
                      name={`${base}.expiryDate`}
                      label="Ngày hết hạn"
                      type="date"
                    />
                    <TextField
                      control={control}
                      name={`${base}.issuer`}
                      label="Đơn vị cấp"
                      placeholder="VD: Sở Nông nghiệp..."
                    />
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

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-emerald-700"
              onClick={() => append({ ...EMPTY_PROFILE_CERT })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm chứng nhận
            </Button>
          </>
        )}
      </div>
    </FormSection>
  );
}
