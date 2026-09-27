import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SearchSelectField, SelectField, TextField } from "@/components/form";
import { useFactoryOptions } from "@/features/factory";
import {
  EMPTY_FACTORY_ACCOUNT,
  FACTORY_ACCOUNT_ROLE_OPTIONS,
  factoryAccountSchema,
  type FactoryAccountFormValues,
} from "@/features/factory-account";

interface FactoryAccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** undefined = create */
  initialValues?: FactoryAccountFormValues;
  isSubmitting?: boolean;
  onSubmit: (values: FactoryAccountFormValues) => void;
}

export function FactoryAccountFormDialog({ open, onOpenChange, initialValues, isSubmitting, onSubmit }: FactoryAccountFormDialogProps) {
  const isEdit = !!initialValues;
  const { options: factoryOptions } = useFactoryOptions();
  const form = useForm<FactoryAccountFormValues>({
    resolver: zodResolver(factoryAccountSchema),
    defaultValues: EMPTY_FACTORY_ACCOUNT,
    mode: "onTouched",
  });
  const { control } = form;

  useEffect(() => {
    if (open) form.reset(initialValues ?? EMPTY_FACTORY_ACCOUNT);
  }, [open, initialValues, form]);

  const submit = form.handleSubmit((values) => {
    if (!isEdit && !values.password) {
      form.setError("password", { message: "Trường này là bắt buộc." });
      return;
    }
    onSubmit(values);
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa tài khoản" : "Tạo tài khoản nhà máy"}
      description="Tài khoản đăng nhập MEVI Factories và nhà máy được gán"
      submitLabel={isEdit ? "Lưu thay đổi" : "Tạo tài khoản"}
      loading={isSubmitting}
      size="lg"
      onSubmit={submit}
    >
      <Form {...form}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField control={control} name="name" label="Họ và tên" required className="sm:col-span-2" />
          <TextField control={control} name="phone" label="Số điện thoại" type="tel" required />
          <TextField control={control} name="email" label="Email" type="email" />
          <SearchSelectField
            control={control}
            name="factoryId"
            label="Nhà máy"
            required
            options={factoryOptions}
            className="sm:col-span-2"
          />
          <SelectField control={control} name="role" label="Vai trò" required options={FACTORY_ACCOUNT_ROLE_OPTIONS} className="sm:col-span-2" />
          <TextField control={control} name="username" label="Tên đăng nhập" required />
          <TextField
            control={control}
            name="password"
            label={isEdit ? "Mật khẩu mới" : "Mật khẩu"}
            type="password"
            required={!isEdit}
            description={isEdit ? "Để trống nếu không đổi mật khẩu" : undefined}
          />
        </div>
      </Form>
    </FormDialog>
  );
}
