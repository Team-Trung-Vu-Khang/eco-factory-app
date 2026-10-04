import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Switch,
  useIsMobile,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import {
  FACTORY_ACCOUNT_STATUS_LABELS,
  useCreateFactoryAccount,
  useFactoryAccounts,
  useSetFactoryAccountStatus,
  useUpdateFactoryAccount,
  type AdminCreateUserInput,
  type AdminFactoryAccountItem,
  type AdminUpdateUserInput,
  type FactoryAccountFormValues,
  type FactoryAccountListParams,
  type FactoryAccountStatus,
} from "@/features/factory-account";
import { useIsFactoryAdmin } from "@/features/viewer";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import { FactoryAccountFormDialog } from "./components/FactoryAccountFormDialog";
import {
  MobileFactoryAccountForm,
  MobileFactoryAccountList,
} from "./components/MobileFactoryAccounts";

/** Helper format SĐT từ dạng 84xxxxxxxxx sang 0xxxxxxxxx */
const formatPhoneNumber = (phone?: string | null): string => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("84") && cleaned.length >= 10) {
    return "0" + cleaned.slice(2);
  }
  return phone;
};

/** Kiểm tra tài khoản có phải tài khoản quản trị viên không */
const isTargetAdminAccount = (a: AdminFactoryAccountItem): boolean => {
  const globalRoles = a.roleCodes ?? [];
  const workspaceRoles = a.workspaces?.flatMap((w) => w.roleCodes ?? []) ?? [];
  const allRoles = [...globalRoles, ...workspaceRoles];
  return allRoles.some(
    (r) =>
      r === "MEVI_ADMIN" || r === "MEVI_SUPER_ADMIN" || r.endsWith("_ADMIN"),
  );
};

const toFormValues = (
  a: AdminFactoryAccountItem,
): FactoryAccountFormValues => ({
  fullName: a.fullName,
  phoneNumber: formatPhoneNumber(a.phoneNumber) || a.username,
  email: a.email ?? "",
  workspaceId: a.workspaces?.[0]?.id ? String(a.workspaces[0].id) : "",
  password: "",
  operatingArea: a.operatingArea ?? "",
  province: a.province ?? "",
  commune: a.commune ?? "",
  birthYear: a.birthYear ?? undefined,
  audienceType: a.audienceType ?? undefined,
});

/** Quản lý tài khoản chủ nhà máy (Admin) */
export default function FactoryAccountPage() {
  const { toast } = useToast();
  const isFactoryAdmin = useIsFactoryAdmin();
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();
  // Mobile app: card list + full-screen form instead of table + dialog
  const mobileApp = isMobile && mobileUiMode === "app";

  // State phân trang & tìm kiếm
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  // Form Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] =
    useState<AdminFactoryAccountItem | null>(null);

  // Search Debounce 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 400);
    return () => clearTimeout(timer);
  }, [keyword]);

  const queryParams: FactoryAccountListParams = useMemo(
    () => ({
      page,
      size,
      keyword: debouncedKeyword.trim() || undefined,
      roleCode: "MEVI_FACTORY_MEMBER",
    }),
    [page, size, debouncedKeyword],
  );

  const query = useFactoryAccounts(queryParams);
  const createMutation = useCreateFactoryAccount();
  const updateMutation = useUpdateFactoryAccount();
  const setStatus = useSetFactoryAccountStatus();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleOpenCreate = () => {
    setEditingAccount(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (account: AdminFactoryAccountItem) => {
    if (isTargetAdminAccount(account) && isFactoryAdmin) {
      toast({
        title: "Không thể chỉnh sửa",
        description:
          "Bạn không có quyền chỉnh sửa tài khoản quản trị hệ thống.",
        variant: "destructive",
      });
      return;
    }
    setEditingAccount(account);
    setFormOpen(true);
  };

  const handleSubmit = async (values: FactoryAccountFormValues) => {
    try {
      if (editingAccount) {
        // Xử lý cập nhật tài khoản
        const oldWorkspaceId = editingAccount.workspaces?.[0]?.id;
        const newWorkspaceId = Number(values.workspaceId);

        const payload: AdminUpdateUserInput = {
          fullName: values.fullName.trim(),
          email: values.email?.trim() || undefined,
          password: values.password?.trim() || undefined,
          operatingArea: values.operatingArea?.trim() || undefined,
          province: values.province?.trim() || undefined,
          commune: values.commune?.trim() || undefined,
          birthYear: values.birthYear,
          audienceType: values.audienceType,
        };

        if (newWorkspaceId && newWorkspaceId !== oldWorkspaceId) {
          payload.addWorkspaceRoles = [
            { roleCode: "MEVI_FACTORY_MEMBER", workspaceId: newWorkspaceId },
          ];
          if (oldWorkspaceId) {
            payload.removeWorkspaceRoles = [
              { roleCode: "MEVI_FACTORY_MEMBER", workspaceId: oldWorkspaceId },
            ];
          }
        }

        await updateMutation.mutateAsync({
          id: editingAccount.id,
          payload,
        });

        toast({
          title: "Thành công",
          description: `Đã cập nhật thông tin tài khoản "${values.fullName}".`,
        });
      } else {
        // Xử lý tạo mới tài khoản
        const payload: AdminCreateUserInput = {
          fullName: values.fullName.trim(),
          phoneNumber: values.phoneNumber.trim(),
          email: values.email?.trim() || undefined,
          password: values.password?.trim() || undefined,
          workspaceRoles: [
            {
              roleCode: "MEVI_FACTORY_MEMBER",
              workspaceId: Number(values.workspaceId),
            },
          ],
          operatingArea: values.operatingArea?.trim() || undefined,
          province: values.province?.trim() || undefined,
          commune: values.commune?.trim() || undefined,
          birthYear: values.birthYear,
          audienceType: values.audienceType,
        };

        await createMutation.mutateAsync(payload);

        toast({
          title: "Thành công",
          description: `Đã tạo tài khoản cho chủ nhà máy "${values.fullName}".`,
        });
      }
      setFormOpen(false);
      setEditingAccount(null);
    } catch (error) {
      toast({
        title: editingAccount
          ? "Không thể cập nhật"
          : "Không thể tạo tài khoản",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const [statusTarget, setStatusTarget] = useState<{
    account: AdminFactoryAccountItem;
    active: boolean;
  } | null>(null);

  const toggleStatus = async (a: AdminFactoryAccountItem, active: boolean) => {
    if (isTargetAdminAccount(a) && isFactoryAdmin) {
      toast({
        title: "Không thể thao tác",
        description:
          "Bạn không có quyền thay đổi trạng thái tài khoản quản trị.",
        variant: "destructive",
      });
      return;
    }

    try {
      const nextStatus: FactoryAccountStatus = active ? "active" : "inactive";
      await setStatus.mutateAsync({
        id: a.id,
        status: nextStatus,
      });
      toast({
        title: "Thành công",
        description: `${active ? "Đã kích hoạt" : "Đã tạm dừng"} tài khoản "${a.fullName}".`,
      });
      setStatusTarget(null);
    } catch (error) {
      toast({
        title: "Không thể cập nhật trạng thái",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const columns: Column<AdminFactoryAccountItem>[] = [
    {
      key: "fullName",
      label: "Tài khoản",
      render: (_, a) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {a.fullName.trim().charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{a.fullName}</p>
            <p className="truncate text-xs text-slate-500">
              @{formatPhoneNumber(a.phoneNumber) || a.username}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "phoneNumber",
      label: "Liên hệ",
      render: (_, a) => (
        <div className="text-sm">
          <p className="text-slate-900">{formatPhoneNumber(a.phoneNumber)}</p>
          {a.email && <p className="text-xs text-slate-500">{a.email}</p>}
        </div>
      ),
    },
    {
      key: "workspaces",
      label: "Nhà máy",
      render: (_, a) => {
        const ws = a.workspaces?.[0];
        const factoryName =
          ws?.factoryProfile?.name || ws?.name || "Chưa gán nhà máy";
        return <span className="text-sm text-slate-700">{factoryName}</span>;
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (_, a) => {
        const isTargetAdmin = isTargetAdminAccount(a);
        const disabled =
          setStatus.isPending || (isTargetAdmin && isFactoryAdmin);
        const isActive = a.status === "active";

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              disabled={disabled}
              onCheckedChange={(checked) =>
                setStatusTarget({ account: a, active: checked })
              }
              aria-label="Kích hoạt / tạm dừng"
            />
            <span
              className={
                isActive
                  ? "text-sm text-emerald-600 font-medium"
                  : "text-sm text-slate-500"
              }
            >
              {FACTORY_ACCOUNT_STATUS_LABELS[a.status] || a.status}
            </span>
          </div>
        );
      },
    },
  ];

  const initialWorkspaceOption = useMemo(() => {
    if (!editingAccount) return undefined;
    const ws = editingAccount.workspaces?.[0];
    if (!ws?.id) return undefined;
    const label =
      ws.factoryProfile?.name ||
      ws.name ||
      (ws.code ? `${ws.code} - #${ws.id}` : `Nhà máy #${ws.id}`);
    return {
      value: String(ws.id),
      label,
    };
  }, [editingAccount]);

  const statusDialog = (
    <Dialog
      open={!!statusTarget}
      onOpenChange={(o) => !o && !setStatus.isPending && setStatusTarget(null)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {statusTarget?.active
              ? "Kích hoạt tài khoản?"
              : "Tạm dừng tài khoản?"}
          </DialogTitle>
          <DialogDescription>
            {statusTarget?.active
              ? `Tài khoản "${statusTarget?.account.fullName}" sẽ có thể đăng nhập và thao tác trở lại.`
              : `Tài khoản "${statusTarget?.account.fullName}" sẽ không thể đăng nhập cho đến khi được kích hoạt lại.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={setStatus.isPending}
            onClick={() => setStatusTarget(null)}
          >
            Hủy
          </Button>
          <Button
            variant={statusTarget?.active ? "default" : "destructive"}
            disabled={setStatus.isPending}
            onClick={() =>
              statusTarget &&
              toggleStatus(statusTarget.account, statusTarget.active)
            }
          >
            {setStatus.isPending
              ? "Đang cập nhật..."
              : statusTarget?.active
                ? "Kích hoạt"
                : "Tạm dừng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (mobileApp)
    return (
      <>
        {formOpen ? (
          <MobileFactoryAccountForm
            key={editingAccount?.id ?? "new"}
            initialValues={
              editingAccount ? toFormValues(editingAccount) : undefined
            }
            initialWorkspaceOption={initialWorkspaceOption}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onClose={() => {
              setFormOpen(false);
              setEditingAccount(null);
            }}
          />
        ) : (
          <MobileFactoryAccountList
            formatPhone={formatPhoneNumber}
            isLocked={(a) => isTargetAdminAccount(a) && isFactoryAdmin}
            togglePending={setStatus.isPending}
            onCreate={handleOpenCreate}
            onEdit={handleOpenEdit}
            onToggle={(account, active) => setStatusTarget({ account, active })}
          />
        )}
        {statusDialog}
      </>
    );

  return (
    <PageWrapper
      title="Quản lý tài khoản nhà máy"
      description="Tạo, tạm dừng và gán tài khoản quản lý cho nhà máy"
      actions={
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo tài khoản
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={query.data?.content ?? []}
        loading={query.isFetching}
        searchable
        searchPlaceholder="Tìm theo tên, SĐT, email..."
        onSearch={(v) => {
          setKeyword(v);
          setPage(0);
        }}
        pageSize={size}
        currentIndex={page + 1}
        totalElements={query.data?.totalElements}
        totalPages={query.data?.totalPages}
        onPageSize={(next) => {
          setSize(next);
          setPage(0);
        }}
        onIndexChange={(index) => setPage(Math.max(0, index - 1))}
        onEdit={handleOpenEdit}
      />

      <FactoryAccountFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingAccount(null);
        }}
        initialValues={
          editingAccount ? toFormValues(editingAccount) : undefined
        }
        initialWorkspaceOption={initialWorkspaceOption}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      {statusDialog}
    </PageWrapper>
  );
}
