import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { TextField } from "@/components/form";
import { AUTH_PATHS } from "@/config/auth";
import { AuthShell } from "./AuthShell";

const REQUIRED = "Trường này là bắt buộc.";

const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, REQUIRED),
    phone: z.string().trim().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ."),
    email: z.union([z.literal(""), z.string().trim().email("Email không hợp lệ.")]),
    factoryName: z.string().trim().min(1, REQUIRED),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự."),
    confirmPassword: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.confirmPassword !== v.password) ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: "Mật khẩu nhập lại không khớp." });
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", phone: "", email: "", factoryName: "", password: "", confirmPassword: "" },
    mode: "onTouched",
  });
  const { control } = form;

  // TODO: POST /auth/register once the BE exposes it; factory accounts wait for admin approval
  const submit = form.handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 500));
    toast({
      title: "Đăng ký thành công",
      description: "Tài khoản nhà máy đang chờ quản trị viên duyệt.",
    });
    navigate(AUTH_PATHS.loginPage);
  });

  return (
    <AuthShell title="Đăng ký tài khoản nhà máy" description="Dành cho chủ nhà máy / cơ sở chế biến">
      <Form {...form}>
        <form onSubmit={submit} className="space-y-4">
          <TextField control={control} name="factoryName" label="Tên nhà máy / cơ sở" required />
          <TextField control={control} name="fullName" label="Họ tên chủ nhà máy" required />
          <TextField control={control} name="phone" label="Số điện thoại" type="tel" required placeholder="VD: 0987654321" />
          <TextField control={control} name="email" label="Email" type="email" />
          <TextField control={control} name="password" label="Mật khẩu" type="password" required />
          <TextField control={control} name="confirmPassword" label="Nhập lại mật khẩu" type="password" required />

          <Button type="submit" className="h-11 w-full" disabled={form.formState.isSubmitting}>
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
