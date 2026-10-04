import { Form } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  UploadStatusProvider,
  useUploadStatusState,
  type SchemaStep,
} from "@/components/form";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import { WizardFooter, WizardHeader } from "./wizard-ui";

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>;
  steps: SchemaStep<T>[];
  /** Short names for the progress header (defaults to step titles) */
  stepLabels?: string[];
  title: string;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: T) => void;
  onCancel: () => void;
}

/**
 * Mobile-app version of SchemaStepperForm: same steps & per-step validation,
 * wizard look (banner + progress, step card, sticky footer).
 */
export function MobileStepperForm<T extends FieldValues>({
  form,
  steps,
  stepLabels,
  title,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: Props<T>) {
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLFormElement>();
  const [index, setIndex] = useState(0);
  const upload = useUploadStatusState();
  const step = steps[index];
  const last = index === steps.length - 1;

  const go = (next: number) => {
    setIndex(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = async () => {
    // Only this step's fields must be valid to move on (same rule as desktop)
    if (await form.trigger(step.fields as Path<T>[])) go(index + 1);
  };

  const primary =
    "flex h-14 flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-[#14532d] text-base font-semibold text-white shadow-lg shadow-emerald-900/25 active:scale-[0.98] disabled:opacity-70";

  return (
    <UploadStatusProvider value={upload}>
      <Form {...form}>
        <form
          ref={fillRef}
          style={{ minHeight: fillHeight }}
          onSubmit={(e) => e.preventDefault()}
          className="-mx-4 -mt-4 -mb-[calc(5.5rem+env(safe-area-inset-bottom))] flex flex-col overflow-x-clip bg-[#f7f5ee] px-4 pt-4"
        >
          <WizardHeader
            step={index + 1}
            labels={stepLabels ?? steps.map((s) => s.title)}
            onBack={() => (index > 0 ? go(index - 1) : onCancel())}
          />

          <div className="relative flex-1">
            <h1 className="text-[1.625rem] font-extrabold leading-tight tracking-tight text-[#0f3d22]">
              {title}
            </h1>
            <p className="mb-4 text-sm text-slate-600">
              Bước {index + 1}/{steps.length} · {step.description ?? step.title}
            </p>

            {/* key → re-run the slide-in when the step changes */}
            <div
              key={step.id}
              className="fsl-card-in rounded-3xl bg-white p-4 shadow-[0_2px_12px_rgba(20,83,45,0.06)] ring-1 ring-emerald-900/5 [&_h2]:text-base"
            >
              {step.content}
            </div>
          </div>

          <WizardFooter>
            {index > 0 && (
              <button
                type="button"
                onClick={() => go(index - 1)}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white text-base font-semibold text-slate-800 shadow-sm active:scale-[0.98]"
              >
                <ArrowLeft className="h-5 w-5" /> Quay lại
              </button>
            )}
            {last ? (
              <button
                type="button"
                disabled={isSubmitting || upload.isUploading}
                onClick={form.handleSubmit(onSubmit)}
                className={primary}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Check className="h-5 w-5" />
                )}
                {submitLabel}
              </button>
            ) : (
              <button
                type="button"
                disabled={upload.isUploading}
                onClick={next}
                className={primary}
              >
                {upload.isUploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Đang tải ảnh...
                  </>
                ) : (
                  <>
                    Tiếp tục <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </WizardFooter>
        </form>
      </Form>
    </UploadStatusProvider>
  );
}
