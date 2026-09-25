import {
  FormSection,
  ImageUploadField,
  SearchSelectField,
  SelectField,
  TextareaField,
  TextField,
  useUploadStatus,
} from "@/components/form";
import { PRODUCT_GROUP_OPTIONS } from "@/features/factory";
import { PRODUCT_STATUS_OPTIONS } from "@/features/product";
import { useProductFormContext } from "./useProductFormContext";

/** `showStatus` is false on create — new products are saved as ACTIVE */
export function InfoSection({ showStatus }: { showStatus: boolean }) {
  const { control } = useProductFormContext();
  const { track } = useUploadStatus();

  return (
    <div className="space-y-8">
      <FormSection title="Thông tin sản phẩm">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <TextField control={control} name="name" label="Tên sản phẩm" required className="sm:col-span-2" />
          <TextField control={control} name="sku" label="Mã SKU" placeholder="VD: CST-100" />
          <SearchSelectField control={control} name="productGroupId" label="Nhóm nông sản" required options={PRODUCT_GROUP_OPTIONS} />
          {showStatus && (
            <SelectField control={control} name="status" label="Trạng thái" required options={PRODUCT_STATUS_OPTIONS} />
          )}
          <TextareaField control={control} name="description" label="Mô tả" rows={3} className={showStatus ? "sm:col-span-2 lg:col-span-3" : "sm:col-span-2 lg:col-span-4"} />
        </div>
      </FormSection>

      <FormSection title="Hình ảnh" description="Ảnh đầu tiên được dùng làm ảnh đại diện">
        <ImageUploadField control={control} name="images" label="Ảnh sản phẩm" required maxFiles={8} folder="products" onUploadingChange={track} />
      </FormSection>
    </div>
  );
}
