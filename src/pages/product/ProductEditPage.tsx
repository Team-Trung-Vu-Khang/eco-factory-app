import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation, useParams } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import { DetailPageSkeleton, NotFoundState } from "@/components/common/PageState";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import {
  toProductFormValues,
  useUpdateProduct,
  useProduct,
  type ProductFormValues,
} from "@/features/product";
import { ProductStepperForm } from "./components/form/ProductStepperForm";

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { data: product, isLoading, isError } = useProduct(id);
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      await updateProduct.mutateAsync({ id, values });
      toast({ title: "Thành công", description: "Đã cập nhật sản phẩm." });
      navigate(ROUTES.productDetail(id));
    } catch (error) {
      toast({ title: "Không thể lưu", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper
      title="Chỉnh sửa sản phẩm"
      description={product?.name}
      overflow="visible"
      actions={<BackButton to={ROUTES.productDetail(id)} />}
    >
      {isLoading ? (
        <DetailPageSkeleton />
      ) : isError || !product ? (
        <NotFoundState message="Không tìm thấy sản phẩm hoặc đã bị xóa." onBack={() => navigate(ROUTES.products)} />
      ) : (
        <ProductStepperForm
          mode="edit"
          key={product.id}
          defaultValues={toProductFormValues(product)}
          submitLabel="Lưu thay đổi"
          isSubmitting={updateProduct.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.productDetail(id))}
        />
      )}
    </PageWrapper>
  );
}
