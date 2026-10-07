import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { Link, useLocation } from "wouter";
import { PasswordField, SelectField, TextField } from "@/components/form";
import { AUTH_PATHS } from "@/config/auth";
import { registrationApi } from "@/features/auth";
import {
  getApiErrorDetails,
  getApiErrorMessage,
  getFieldErrorMessage,
} from "@/lib/api-error";
import { AuthShell } from "./AuthShell";
import { FactoryProfileFields } from "./register/FactoryProfileFields";
import {
  PHONE_TAKEN_MESSAGE,
  usePhoneAvailability,
} from "./register/usePhoneAvailability";
import {
  AUDIENCE_TYPE_OPTIONS,
  EMPTY_REGISTER,
  registerSchema,
  toFormPath,
  toRegistrationRequest,
  type RegisterValues,
} from "./register/register-schema";

const ACCOUNT_FIELDS = [
  "fullName",
  "phone",
  "email",
  "audienceType",
  "password",
  "confirmPassword",
] as const satisfies readonly FieldPath<RegisterValues>[];

const STEPS = ["Tài khoản", "Thông tin nhà máy"];

export default function RegisterPage() {
  const [step, setStep] = useState<0 | 1>(0);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: EMPTY_REGISTER,
    mode: "onTouched",
  });
  const { control, setError, clearErrors } = form;
  const [fullName, phone, password, confirmPassword, profileName] = useWatch({
    control,
    name: ["fullName", "phone", "password", "confirmPassword", "profile.name"],
  });
  const missingAccount = ![fullName, phone, password, confirmPassword].every(
    (v) => v?.trim(),
  );
  const missingProfile = !profileName?.trim();
  const phoneStatus = usePhoneAvailability(control, setError, clearErrors);

  const goNext = async () => {
    if (phoneStatus === "taken") {
      setError("phone", { type: "taken", message: PHONE_TAKEN_MESSAGE }, { shouldFocus: true });
      return;
    }
    if (await form.trigger(ACCOUNT_FIELDS, { shouldFocus: true })) setStep(1);
  };

  const submit = form.handleSubmit(async (values) => {
    if (phoneStatus === "taken") {
      setStep(0);
      setError("phone", { type: "taken", message: PHONE_TAKEN_MESSAGE }, { shouldFocus: true });
      return;
    }
    try {
      await registrationApi.register(toRegistrationRequest(values));
      toast({
        title: "Đăng ký thành công",
        description:
          "Hệ thống đang khởi tạo không gian nhà máy. Hồ sơ sẽ được quản trị viên duyệt trước khi hiển thị trên sàn.",
      });
      navigate(AUTH_PATHS.loginPage);
    } catch (error) {
      const { fieldErrors } = getApiErrorDetails(error);
      let mapped = 0;
      let accountError = false;
      for (const [apiPath, reason] of Object.entries(fieldErrors)) {
        const path = toFormPath(apiPath);
        if (!path) continue;
        if (!path.startsWith("profile.")) accountError = true;
        setError(path as FieldPath<RegisterValues>, {
          message: getFieldErrorMessage(reason),
        });
        mapped++;
      }
      // Account-field errors live on step 1 → go back so they're visible
      if (accountError) setStep(0);
      if (mapped < Object.keys(fieldErrors).length || mapped === 0)
        toast({
          title: "Đăng ký thất bại",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
    }
  }, (errors) => {
    if (ACCOUNT_FIELDS.some((f) => errors[f])) setStep(0);
  });

  return (
    <AuthShell
      wide
      title="Đăng ký tài khoản nhà máy"
      description="Dành cho chủ nhà máy / cơ sở chế biến"
    >
      <Form {...form}>
        <form
          // Enter on step 1 → next step, not submit
          onSubmit={(e) => {
            if (step === 0) {
              e.preventDefault();
              void goNext();
            } else void submit(e);
          }}
          className="space-y-4"
          noValidate
        >
          <ol className="mx-auto flex max-w-xs items-start text-xs font-medium">
            {STEPS.map((label, i) => (
              <li key={label} className="relative flex flex-1 flex-col items-center gap-1.5">
                {/* Connector to the previous step, behind the circles */}
                {i > 0 && (
                  <span
                    className={`absolute right-1/2 top-3.5 h-0.5 w-full -translate-y-1/2 ${
                      step >= i ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full ${
                    i <= step
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </span>
                <span className={i === step ? "text-slate-900" : "text-slate-500"}>
                  {label}
                </span>
              </li>
            ))}
          </ol>

          <div className={step === 0 ? "grid gap-3 sm:grid-cols-2" : "hidden"}>            <TextField control={control} name="fullName" label="Họ tên" required placeholder="VD: Nguyễn Văn An" />
            <TextField
              control={control}
              name="phone"
              label="Số điện thoại"
              type="tel"
              required
              placeholder="VD: 0987654321"
              description={
                phoneStatus === "checking" ? (
                  <span className="inline-flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Đang kiểm tra số điện thoại...
                  </span>
                ) : phoneStatus === "available" ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" /> Số điện thoại có thể sử dụng
                  </span>
                ) : undefined
              }
            />
            <TextField control={control} name="email" label="Email" type="email" placeholder="VD: an@example.com" />
            <SelectField control={control} name="audienceType" label="Loại đối tượng" required options={AUDIENCE_TYPE_OPTIONS} placeholder="Chọn loại đối tượng" />
            <PasswordField control={control} name="password" label="Mật khẩu" required placeholder="Tối thiểu 8 ký tự" />
            <PasswordField control={control} name="confirmPassword" label="Nhập lại mật khẩu" required placeholder="Nhập lại mật khẩu" />
          </div>

          {step === 0 ? (
            <Button
              type="button"
              className="h-11 w-full"
              onClick={goNext}
              disabled={missingAccount || phoneStatus === "checking"}
            >
              Tiếp theo
            </Button>
          ) : (
            <>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Thông tin nhà máy <span className="text-rose-500">*</span>
                </p>
                <p className="text-xs text-slate-500">
                  Hồ sơ sẽ được quản trị viên duyệt trước khi hiển thị trên sàn.
                </p>
              </div>
              <FactoryProfileFields />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11"
                  onClick={() => setStep(0)}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Quay lại
                </Button>
                <Button
                  type="submit"
                  className="h-11 flex-1"
                  disabled={missingProfile || form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Đăng ký
                </Button>
              </div>
            </>
          )}
          <p className="text-center text-sm text-slate-600">
            Đã có tài khoản?{" "}
            <Link href={AUTH_PATHS.loginPage} className="font-medium text-emerald-700 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </Form>
    </AuthShell>
  );
}
