import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import { BackButton } from "@/components/common/BackButton";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { EMPTY_PRODUCT, useCreateProduct, type ProductFormValues } from "@/features/product";
import { ProductStepperForm } from "./components/form/ProductStepperForm";

export default function ProductCreatePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const createProduct = useCreateProduct();

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const created = await createProduct.mutateAsync(values);
      toast({ title: "Thành công", description: "Đã thêm sản phẩm." });
      navigate(ROUTES.productDetail(created.id));
    } catch (error) {
      toast({ title: "Không thể lưu", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper
      title="Thêm sản phẩm"
      description="Khai báo sản phẩm chế biến của nhà máy"
      overflow="visible"
      actions={<BackButton to={ROUTES.products} />}
    >
      <ProductStepperForm
        mode="create"
        defaultValues={EMPTY_PRODUCT}
        submitLabel="Tạo sản phẩm"
        isSubmitting={createProduct.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.products)}
      />
    </PageWrapper>
  );
}
