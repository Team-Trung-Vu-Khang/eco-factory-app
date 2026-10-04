import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  EMPTY_FACTORY_ACCOUNT,
  factoryAccountSchema,
  type FactoryAccountFormValues,
} from "@/features/factory-account";
import { FactoryAccountFormFields } from "./FactoryAccountFormFields";

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
        <FactoryAccountFormFields
          control={control}
          isEdit={isEdit}
          initialOptions={initialOptions}
        />
      </Form>
    </FormDialog>
  );
}
