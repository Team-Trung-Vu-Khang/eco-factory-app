import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import {
  useConnections,
  useFactorySearch,
  useRegisterConnection,
  type FactorySearchParams,
  type MatchedMachine,
} from "@/features/connection";
import { useCurrentFarmer } from "@/features/viewer";
import { FactoryResultCard } from "./components/FactoryResultCard";
import { RegisterDialog, type RegisterValues } from "./components/RegisterDialog";
import { SearchFilters } from "./components/SearchFilters";

export default function ConnectionSearchPage() {
  const { toast } = useToast();
  const farmer = useCurrentFarmer();
  const [params, setParams] = useState<FactorySearchParams>();
  const [registering, setRegistering] = useState<MatchedMachine | null>(null);

  const search = useFactorySearch(params);
  const register = useRegisterConnection();
  const mine = useConnections({ page: 0, size: 500, farmerId: farmer.id, status: "PENDING" });
  const pendingScheduleIds = useMemo(() => new Set((mine.data?.content ?? []).map((c) => c.scheduleId)), [mine.data]);
  const results = search.data ?? [];

  const handleRegister = async (values: RegisterValues) => {
    const result = results.find((r) => r.factory.id === registering?.factoryId);
    if (!registering || !result) return;
    try {
      await register.mutateAsync({ farmer, factory: result.factory, machine: registering, cropIds: values.cropIds, quantity: values.quantity, note: values.note });
      toast({ title: "Đã đăng ký", description: "Yêu cầu đang chờ kết nối." });
      setRegistering(null);
    } catch (error) {
      toast({ title: "Không thể đăng ký", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper title="Tìm kiếm nhà máy" description="Tìm nhà máy đang nhận chế biến phù hợp với vị trí, chức năng và cây trồng" overflow="visible">
      <div className="space-y-6">
        <SearchFilters loading={search.isFetching} onSearch={setParams} />

        {!params ? (
          <p className="py-10 text-center text-sm text-slate-500">Chọn điều kiện và bấm Tìm kiếm để xem nhà máy phù hợp.</p>
        ) : search.isLoading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : (
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-semibold text-slate-900">{results.length} nhà máy phù hợp</h2>
              <Link href={ROUTES.connectionHistory} className="text-sm text-emerald-700 hover:underline">
                Lịch sử kết nối
              </Link>
            </div>
            {results.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
                <SearchX className="h-5 w-5" />
                Chưa có nhà máy đang nhận chế biến phù hợp. Thử mở rộng phạm vi hoặc bỏ bớt điều kiện.
              </div>
            ) : (
              results.map((r) => (
                <FactoryResultCard key={r.factory.id} result={r} pendingScheduleIds={pendingScheduleIds} onRegister={setRegistering} />
              ))
            )}
          </section>
        )}
      </div>

      <RegisterDialog
        machine={registering}
        defaultCropIds={params?.cropIds ?? []}
        isSubmitting={register.isPending}
        onOpenChange={(open) => !open && setRegistering(null)}
        onSubmit={handleRegister}
      />
    </PageWrapper>
  );
}
