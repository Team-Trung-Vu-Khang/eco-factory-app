import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { LogIn } from "lucide-react";
import { Link } from "wouter";
import { AUTH_PATHS } from "@/config/auth";
import { authApi } from "@/features/auth";
import { AuthShell } from "./AuthShell";

export default function LoginPage() {
  return (
    <AuthShell title="Đăng nhập" description="Hệ thống kết nối nhà máy chế biến nông sản">
      <div className="space-y-4">
        <Button type="button" className="h-11 w-full" onClick={() => authApi.startLogin(authApi.getDefaultProvider())}>
          <LogIn className="mr-2 h-4 w-4" />
          Đăng nhập bằng tài khoản MEVI
        </Button>
        <p className="text-center text-sm text-slate-600">
          Chủ nhà máy chưa có tài khoản?{" "}
          <Link href={AUTH_PATHS.register} className="font-medium text-emerald-700 hover:underline">
            Đăng ký nhà máy
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
