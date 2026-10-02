import {
  Button,
  DeleteDialog,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { DataTable } from "@/components/common/DataTable";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import { useFactoryOptions } from "@/features/factory";
import {
  useAdminDeleteFactoryMachine,
  useAdminFactoryMachines,
  useCreateFactoryMachine,
  useDeleteFactoryMachine,
  useFactoryMachines,
  useUpdateFactoryMachine,
  type FactoryMachineItem,
  type FactoryMachineListParams,
} from "@/features/machine";
import { useProcessingServiceOptions } from "@/features/processing-service";
import { useProductGroupOptions } from "@/features/product-group";
import { useIsFactoryAdmin } from "@/features/viewer";
import {
  factoryColumn,
  machineColumns,
  machineFilters,
} from "./components/machine-columns";
import { MachineFormDialog } from "./components/MachineFormDialog";
import type { MachineDialogValues } from "./components/machine-form-schema";

const toDialogValues = (m: FactoryMachineItem): MachineDialogValues => ({
  id: m.id,
  name: m.name,
  status: m.status,
  processingServiceIds: (m.processingServices ?? []).map((s) => s.id),
  maxCapacity: m.maxCapacity,
  capacityUnit: m.capacityUnit,
  productGroupIds: (m.productGroups ?? []).map((g) => g.id),
});

export default function MachinePage() {
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [filters, setFilters] = useState<
    Pick<
      FactoryMachineListParams,
      "status" | "processingServiceId" | "productGroupId" | "profileId"
    >
  >({});
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FactoryMachineItem | null>(null);
  const [deleting, setDeleting] = useState<FactoryMachineItem | null>(null);

  // Search debounce 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 400);
    return () => clearTimeout(timer);
  }, [keyword]);

  const isAdmin = useIsFactoryAdmin();
  const { options: factoryOptions } = useFactoryOptions();
  const processingServiceOptions = useProcessingServiceOptions();
  const productGroupOptions = useProductGroupOptions();

  const queryParams: FactoryMachineListParams = useMemo(
    () => ({
      page,
      size,
      keyword: debouncedKeyword.trim() || undefined,
      status: filters.status,
      processingServiceId: filters.processingServiceId
        ? Number(filters.processingServiceId)
        : undefined,
      productGroupId: filters.productGroupId
        ? Number(filters.productGroupId)
        : undefined,
      profileId: filters.profileId ? Number(filters.profileId) : undefined,
    }),
    [page, size, debouncedKeyword, filters],
  );

  const memberQuery = useFactoryMachines(queryParams, { enabled: !isAdmin });
  const adminQuery = useAdminFactoryMachines(queryParams, { enabled: isAdmin });
  const query = isAdmin ? adminQuery : memberQuery;

  const createMachine = useCreateFactoryMachine();
  const updateMachine = useUpdateFactoryMachine();
  const deleteMemberMachine = useDeleteFactoryMachine();
  const deleteAdminMachine = useAdminDeleteFactoryMachine();

  const isSubmitting = createMachine.isPending || updateMachine.isPending;
  const isDeleting =
    deleteMemberMachine.isPending || deleteAdminMachine.isPending;

  const columns = useMemo(
    () => (isAdmin ? [factoryColumn, ...machineColumns] : machineColumns),
    [isAdmin],
  );

  const tableFilters = useMemo(
    () => [
      ...(isAdmin && factoryOptions.length
        ? [{ key: "profileId", label: "Nhà máy", options: factoryOptions }]
        : []),
      ...machineFilters,
      ...(processingServiceOptions.length
        ? [
            {
              key: "processingServiceId",
              label: "Dịch vụ",
              options: processingServiceOptions,
            },
          ]
        : []),
      ...(productGroupOptions.length
        ? [
            {
              key: "productGroupId",
              label: "Nhóm nông sản",
              options: productGroupOptions,
            },
          ]
        : []),
    ],
    [isAdmin, factoryOptions, processingServiceOptions, productGroupOptions],
  );

  const editingValues = useMemo(
    () => (editing ? toDialogValues(editing) : undefined),
    [editing],
  );

  const fail = (title: string, error: unknown) => {
    const err = error as { status?: number; response?: { status?: number } };
    const is409 =
      err?.status === 409 ||
      err?.response?.status === 409 ||
      (error as Error)?.message?.includes("đang được sử dụng");

    toast({
      title,
      description: is409
        ? "Máy đang có lịch nhận chế biến hoặc dữ liệu liên quan. Vui lòng chuyển trạng thái máy sang tạm dừng hoặc xóa các lịch nhận chế biến trước."
        : (error as Error).message,
      variant: "destructive",
    });
  };

  const handleSubmit = async (values: MachineDialogValues) => {
    try {
      const payload = {
        name: values.name.trim(),
        status: values.status,
        processingServiceIds: values.processingServiceIds.map((id) =>
          Number(id),
        ),
        maxCapacity: values.maxCapacity,
        capacityUnit: values.capacityUnit,
        productGroupIds: values.productGroupIds.map((id) => Number(id)),
      };

      if (editing?.id) {
        await updateMachine.mutateAsync({ id: editing.id, input: payload });
        toast({
          title: "Thành công",
          description: `Đã cập nhật máy "${values.name}".`,
        });
      } else {
        await createMachine.mutateAsync(payload);
        toast({
          title: "Thành công",
          description: `Đã thêm máy "${values.name}".`,
        });
      }
      setFormOpen(false);
      setEditing(null);
    } catch (error) {
      fail("Không thể lưu", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      if (isAdmin) {
        await deleteAdminMachine.mutateAsync(deleting.id);
      } else {
        await deleteMemberMachine.mutateAsync(deleting.id);
      }
      toast({
        title: "Đã xóa",
        description: `Đã xóa máy "${deleting.name}".`,
      });
      setDeleting(null);
    } catch (error) {
      fail("Không thể xóa", error);
    }
  };

  return (
    <PageWrapper
      title="Máy & Dây chuyền"
      description="Quản lý danh sách thiết bị, dịch vụ chế biến và công suất của nhà máy"
      actions={
        !isAdmin ? (
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm máy
          </Button>
        ) : undefined
      }
    >
      <DataTable
        columns={columns}
        data={query.data?.content ?? []}
        loading={query.isFetching}
        searchable
        searchPlaceholder={
          isAdmin
            ? "Tìm theo mã, tên máy, nhà máy..."
            : "Tìm theo mã, tên máy..."
        }
        onSearch={(v) => {
          setKeyword(v);
          setPage(0);
        }}
        filters={tableFilters}
        onFilterChange={(key, value) => {
          setFilters((prev) => ({
            ...prev,
            [key]: value && value !== "all" ? value : undefined,
          }));
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
        onEdit={
          !isAdmin
            ? (m) => {
                setEditing(m);
                setFormOpen(true);
              }
            : undefined
        }
        onDelete={setDeleting}
      />

      <MachineFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        initialValues={editingValues}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        description={`Bạn có chắc chắn muốn xóa máy "${deleting?.name ?? ""}" (Mã: ${deleting?.code ?? ""}) không?`}
      />
    </PageWrapper>
  );
}
