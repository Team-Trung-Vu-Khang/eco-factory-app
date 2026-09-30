import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { AsyncSearchSelectField, TextField } from "@/components/form";
import {
  EMPTY_FACTORY_ACCOUNT,
  factoryAccountSchema,
  type FactoryAccountFormValues,
} from "@/features/factory-account";
import { fetchWorkspaceOptions } from "@/features/workspace";

interface FactoryAccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** undefined = create */
  initialValues?: FactoryAccountFormValues;
  /** Initial selected workspace label for edit mode */
  initialWorkspaceOption?: { value: string; label: string };
  isSubmitting?: boolean;
  onSubmit: (values: FactoryAccountFormValues) => void;
}

export function FactoryAccountFormDialog({
  open,
  onOpenChange,
  initialValues,
  initialWorkspaceOption,
  isSubmitting,
  onSubmit,
}: FactoryAccountFormDialogProps) {
  const isEdit = !!initialValues;
  const form = useForm<FactoryAccountFormValues>({
    resolver: zodResolver(factoryAccountSchema),
    defaultValues: EMPTY_FACTORY_ACCOUNT,
    mode: "onTouched",
  });
  const { control } = form;

  useEffect(() => {
    if (open) {
      form.reset(initialValues ?? EMPTY_FACTORY_ACCOUNT);
    }
  }, [open, initialValues, form]);

  const initialOptions = useMemo(() => {
    if (initialWorkspaceOption && initialWorkspaceOption.value) {
      return [initialWorkspaceOption];
    }
    return [];
  }, [initialWorkspaceOption]);

  const submit = form.handleSubmit((values) => {
    onSubmit(values);
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        isEdit ? "Chỉnh sửa tài khoản chủ nhà máy" : "Tạo tài khoản chủ nhà máy"
      }
      description="Tài khoản đăng nhập MEVI và nhà máy (workspace) được gán quyền quản lý"
      submitLabel={isEdit ? "Lưu thay đổi" : "Tạo tài khoản"}
      loading={isSubmitting}
      size="lg"
      onSubmit={submit}
    >
      <Form {...form}>
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
          <TextField
            control={control}
            name="password"
            label={isEdit ? "Mật khẩu mới (tùy chọn)" : "Mật khẩu (tùy chọn)"}
            type="password"
            className="sm:col-span-2"
            description={
              isEdit
                ? "Để trống nếu giữ nguyên mật khẩu cũ. Đổi mật khẩu sẽ đăng xuất tất cả phiên đăng nhập hiện có."
                : "Để trống hệ thống sẽ đặt mật khẩu mặc định (người dùng đổi khi đăng nhập lần đầu)."
            }
          />
        </div>
      </Form>
    </FormDialog>
  );
}
