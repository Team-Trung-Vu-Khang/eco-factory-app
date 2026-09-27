import { Button, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { SearchX } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { useConnectFactories, useFactorySearch, type FactorySearchParams } from "@/features/connection";
import { useCurrentFarmer, useIsFactoryAdmin } from "@/features/viewer";
import { FactoryResultTable } from "./components/FactoryResultTable";
import { SearchFilters } from "./components/SearchFilters";

export default function ConnectionSearchPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const farmer = useCurrentFarmer();
  const isAdmin = useIsFactoryAdmin();
  const [params, setParams] = useState<FactorySearchParams>();

  const search = useFactorySearch(params);
  const connect = useConnectFactories();
  const results = search.data ?? [];

  const handleConnect = async (criteria: FactorySearchParams) => {
    try {
      await connect.mutateAsync({ farmer, criteria });
      toast({
        title: "Đã gửi yêu cầu kết nối",
        description: "Hệ thống sẽ kết nối bạn với nhà máy phù hợp.",
        action: (
          <Button size="sm" variant="outline" onClick={() => navigate(ROUTES.connectionHistory)}>
            Xem lịch sử
          </Button>
        ),
      });
    } catch (error) {
      toast({ title: "Không thể gửi yêu cầu", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper
      title={isAdmin ? "Tìm kiếm nhà máy" : "Kết nối nhà máy"}
      description={
        isAdmin
          ? "Tìm nhà máy theo khu vực, dịch vụ, nhóm nông sản và chứng nhận"
          : "Nhập nhu cầu chế biến rồi bấm Kết nối nhà máy — hoặc xem trước các nhà máy đang nhận chế biến phù hợp"
      }
      overflow="visible"
    >
      <div className="space-y-6">
        <SearchFilters
          key={isAdmin ? "admin" : "member"}
          mode={isAdmin ? "admin" : "member"}
          searching={search.isFetching} connecting={connect.isPending} onSearch={setParams} onConnect={handleConnect}
        />

        {!params ? (
          <p className="py-10 text-center text-sm text-slate-500">Bấm "Xem nhà máy phù hợp" để xem danh sách nhà máy theo điều kiện đã nhập.</p>
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
              <FactoryResultTable results={results} />
            )}
          </section>
        )}
      </div>
    </PageWrapper>
  );
}
