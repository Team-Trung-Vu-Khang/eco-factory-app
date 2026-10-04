import type { Control } from "react-hook-form";
import {
  AsyncSearchSelectField,
  PasswordField,
  TextField,
} from "@/components/form";
import type { FactoryAccountFormValues } from "@/features/factory-account";
import { fetchWorkspaceOptions } from "@/features/workspace";

/** Account fields shared by the desktop dialog and the mobile form */
export function FactoryAccountFormFields({
  control,
  isEdit,
  initialOptions,
}: {
  control: Control<FactoryAccountFormValues>;
  isEdit: boolean;
  initialOptions: { value: string; label: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField
        control={control}
        name="fullName"
        label="Họ và tên"
        required
        className="sm:col-span-2"
      />
      <TextField
        control={control}
        name="phoneNumber"
        label="Số điện thoại"
        type="tel"
        required
        disabled={isEdit}
        description={
          isEdit
            ? "Số điện thoại là tên đăng nhập, không thể thay đổi sau khi tạo."
            : "SĐT di động VN (dùng làm tên đăng nhập hệ thống)."
        }
      />
      <TextField
        control={control}
        name="email"
        label="Email"
        type="email"
        description="Địa chỉ email nhận thông báo (tùy chọn)."
      />
      <AsyncSearchSelectField
        control={control}
        name="workspaceId"
        label="Nhà máy được gán"
        required
        fetchOptions={fetchWorkspaceOptions}
        initialOptions={initialOptions}
        placeholder="Tìm & chọn nhà máy..."
        searchPlaceholder="Gõ tên hoặc mã nhà máy để tìm..."
        className="sm:col-span-2"
      />
      <PasswordField
        control={control}
        name="password"
        label={isEdit ? "Mật khẩu mới (tùy chọn)" : "Mật khẩu (tùy chọn)"}
        className="sm:col-span-2"
        description={
          isEdit
            ? "Để trống nếu giữ nguyên mật khẩu cũ. Đổi mật khẩu sẽ đăng xuất tất cả phiên đăng nhập hiện có."
            : "Để trống hệ thống sẽ đặt mật khẩu mặc định (người dùng đổi khi đăng nhập lần đầu)."
        }
      />
    </div>
  );
}
