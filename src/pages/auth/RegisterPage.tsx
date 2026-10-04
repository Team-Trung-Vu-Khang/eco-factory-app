import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
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

export default function RegisterPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const form = useForm<RegisterValues>({
    // Collapsed profile section is not sent, so don't let its leftovers block submit
    resolver: (values, ctx, opts) =>
      zodResolver(registerSchema)(
        values.withProfile ? values : { ...values, profile: EMPTY_REGISTER.profile },
        ctx,
        opts,
      ),
    defaultValues: EMPTY_REGISTER,
    mode: "onTouched",
  });
  const { control, setValue, setError, clearErrors } = form;
  const [withProfile, fullName, phone, password, confirmPassword, profileName] = useWatch({
    control,
    name: ["withProfile", "fullName", "phone", "password", "confirmPassword", "profile.name"],
  });
  const missingRequired =
    ![fullName, phone, password, confirmPassword].every((v) => v?.trim()) ||
    (withProfile && !profileName?.trim());
  const phoneStatus = usePhoneAvailability(control, setError, clearErrors);

  const submit = form.handleSubmit(async (values) => {
    if (phoneStatus === "taken") {
      setError("phone", { type: "taken", message: PHONE_TAKEN_MESSAGE }, { shouldFocus: true });
      return;
    }
    try {
      await registrationApi.register(toRegistrationRequest(values));
      toast({
        title: "Đăng ký thành công",
        description: values.withProfile
          ? "Hệ thống đang khởi tạo không gian nhà máy. Hồ sơ sẽ được quản trị viên duyệt trước khi hiển thị trên sàn."
          : "Hệ thống đang khởi tạo không gian nhà máy. Bạn có thể hoàn thiện hồ sơ sau khi đăng nhập.",
      });
      navigate(AUTH_PATHS.loginPage);
    } catch (error) {
      const { fieldErrors } = getApiErrorDetails(error);
      let mapped = 0;
      for (const [apiPath, reason] of Object.entries(fieldErrors)) {
        const path = toFormPath(apiPath);
        if (!path) continue;
        if (path.startsWith("profile.")) setValue("withProfile", true);
        setError(path as FieldPath<RegisterValues>, {
          message: getFieldErrorMessage(reason),
        });
        mapped++;
      }
      if (mapped < Object.keys(fieldErrors).length || mapped === 0)
        toast({
          title: "Đăng ký thất bại",
          description: getApiErrorMessage(error),
          variant: "destructive",
        });
    }
  });

  return (
    <AuthShell
      wide
      title="Đăng ký tài khoản nhà máy"
      description="Dành cho chủ nhà máy / cơ sở chế biến"
    >
      <Form {...form}>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField control={control} name="fullName" label="Họ tên" required placeholder="VD: Nguyễn Văn An" />
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

          <div className="rounded-xl border border-slate-200">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 p-4 text-left"
              aria-expanded={withProfile}
              onClick={() => setValue("withProfile", !withProfile)}
            >
              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Thông tin nhà máy (tùy chọn)
                </span>
                <span className="block text-xs text-slate-500">
                  Có thể bỏ qua và hoàn thiện hồ sơ sau khi đăng nhập.
                </span>
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${withProfile ? "rotate-180" : ""}`}
              />
            </button>
            {withProfile && (
              <div className="border-t border-slate-200 p-4">
                <FactoryProfileFields />
                <button
                  type="button"
                  className="mt-4 text-xs text-slate-500 hover:text-slate-700 hover:underline"
                  onClick={() => setValue("withProfile", false)}
                >
                  Bỏ qua, không gửi thông tin nhà máy
                </button>
              </div>
            )}
          </div>

          <Button type="submit" className="h-11 w-full" disabled={missingRequired || form.formState.isSubmitting || phoneStatus === "checking"}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đăng ký
          </Button>
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
