import dayjs from "dayjs";
import { InfoGrid } from "@/components/common/InfoGrid";
import { FormSection, ImageDropzone } from "@/components/form";
import { PROCESSING_SERVICE_LABELS, PRODUCT_GROUP_LABELS, type ProcessingService } from "@/features/factory";
import {
  OUTPUT_UNIT_LABELS,
  PRODUCT_STATUS_LABELS,
  SHELF_LIFE_UNIT_LABELS,
  WEIGHT_UNIT_LABELS,
  type OutputUnit,
  type ProductFormValues,
  type ProductStatus,
  type ShelfLifeUnit,
  type WeightUnit,
} from "@/features/product";
import { useCertificateOptions } from "../hooks/useCertificateOptions";

const fmt = new Intl.NumberFormat("vi-VN");

/** Read-only view, shared by the review step and the detail page */
export function ProductInfo({ values: p }: { values: ProductFormValues }) {
  const certificateOptions = useCertificateOptions();
  const certLabel = (id: string) => certificateOptions.find((o) => o.value === id)?.label ?? id;

  return (
    <div className="space-y-8">
      <FormSection title="Hình ảnh">
        <ImageDropzone value={p.images} onChange={() => {}} disabled />
      </FormSection>

      <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
        <FormSection title="Thông tin sản phẩm">
          <InfoGrid
            items={[
              { label: "Tên sản phẩm", value: p.name },
              { label: "Mã SKU", value: p.sku },
              { label: "Nhóm nông sản", value: PRODUCT_GROUP_LABELS[p.productGroupId] },
              { label: "Trạng thái", value: PRODUCT_STATUS_LABELS[p.status as ProductStatus] },
              { label: "Mô tả", value: p.description, wide: true },
            ]}
          />
        </FormSection>

        <FormSection title="Nguyên liệu & bảo quản">
          <InfoGrid
            items={[
              { label: "Nguyên liệu chính", value: p.rawMaterials, wide: true },
              { label: "Công đoạn chế biến", value: p.processingServices.map((s) => PROCESSING_SERVICE_LABELS[s as ProcessingService]).join(", "), wide: true },
              { label: "Hạn sử dụng", value: p.shelfLifeValue ? `${p.shelfLifeValue} ${SHELF_LIFE_UNIT_LABELS[p.shelfLifeUnit as ShelfLifeUnit] ?? ""}` : undefined },
              { label: "Điều kiện bảo quản", value: p.storageConditions },
            ]}
          />
        </FormSection>

        <FormSection title="Quy cách đóng gói">
          <ul className="divide-y divide-slate-100 text-sm">
            {p.packagings.map((pk, i) => (
              <li key={pk.id ?? i} className="flex justify-between gap-4 py-2 tabular-nums first:pt-0">
                <span>
                  {pk.name} · {Number.isFinite(pk.netWeight) ? fmt.format(pk.netWeight) : "—"}
                  {WEIGHT_UNIT_LABELS[pk.weightUnit as WeightUnit] ?? ""}
                </span>
                <span className="text-slate-500">{pk.price !== undefined ? `${fmt.format(pk.price)}đ` : "—"}</span>
              </li>
            ))}
          </ul>
        </FormSection>

        <FormSection title="Sản xuất & chỉ số">
          <InfoGrid
            items={[
              { label: "Sản lượng", value: p.outputCapacity ? `${fmt.format(p.outputCapacity)} ${OUTPUT_UNIT_LABELS[p.outputUnit as OutputUnit] ?? ""}` : undefined },
              { label: "Chứng nhận áp dụng", value: p.certificateIds.map(certLabel).join(", "), wide: true },
              { label: "Sản phẩm mới phát triển", value: p.isNewlyDeveloped ? `Có · ra mắt ${p.launchedAt ? dayjs(p.launchedAt).format("DD/MM/YYYY") : "—"}` : "Không" },
            ]}
          />
        </FormSection>
      </div>
    </div>
  );
}
