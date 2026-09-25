import { Button, Form } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2 } from "lucide-react";
import { UploadStatusProvider, useUploadStatusState } from "@/components/form";
import type { FactoryFormValues } from "@/features/factory";
import { ActivitySection } from "./ActivitySection";
import { BasicInfoSection } from "./BasicInfoSection";
import { CertificationsSection } from "./CertificationsSection";
import { ImagesSection } from "./ImagesSection";
import { LocationSection } from "./LocationSection";
import { MachinesSection } from "./MachinesSection";
import { RepresentativeSection } from "./RepresentativeSection";
import { useFactoryForm } from "./useFactoryForm";

interface FactoryFormProps {
  defaultValues: FactoryFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: FactoryFormValues) => void;
  onCancel: () => void;
}

export function FactoryForm({
  defaultValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: FactoryFormProps) {
  const form = useFactoryForm(defaultValues);
  const upload = useUploadStatusState();

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <UploadStatusProvider value={upload}>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
            <BasicInfoSection />
            <RepresentativeSection />
          </div>
          <LocationSection />
          <ActivitySection />
          <MachinesSection />
          <CertificationsSection />
          <ImagesSection />

          <div className="sticky bottom-0 z-10 -mx-1 flex justify-end gap-2 border-t border-slate-200 bg-white/95 px-1 py-3 backdrop-blur">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || upload.isUploading}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {submitLabel}
            </Button>
          </div>
        </form>
      </Form>
    </UploadStatusProvider>
  );
}
