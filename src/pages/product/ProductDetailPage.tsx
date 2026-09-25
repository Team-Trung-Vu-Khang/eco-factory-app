import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Pencil } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import { DetailPageSkeleton, NotFoundState } from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { toProductFormValues, useProduct } from "@/features/product";
import { ProductInfo } from "./components/ProductInfo";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: product, isLoading, isError } = useProduct(id);

  return (
    <PageWrapper
      title={product?.name ?? "Chi tiết sản phẩm"}
      description={product?.sku}
      actions={
        <>
          <BackButton to={ROUTES.products} label="Danh sách" />
          {product && (
            <Button onClick={() => navigate(ROUTES.productEdit(product.id))}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </>
      }
    >
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !product ? (
        <NotFoundState message="Không tìm thấy sản phẩm hoặc đã bị xóa." onBack={() => navigate(ROUTES.products)} />
      ) : (
        <ProductInfo values={toProductFormValues(product)} />
      )}
    </PageWrapper>
  );
}
