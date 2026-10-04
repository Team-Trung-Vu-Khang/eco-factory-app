import { Form, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Ban,
  Boxes,
  ChevronDown,
  FileText,
  FlaskConical,
  Leaf,
  Loader2,
  LocateFixed,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useController,
  useForm,
  useWatch,
  type Control,
} from "react-hook-form";
import {
  AsyncSearchSelectField,
  SelectField,
  TextareaField,
} from "@/components/form";
import { fetchMasterCertificateOptions } from "@/features/certificate";
import type { FactorySearchParams } from "@/features/connection";
import { MATERIAL_CONDITION_OPTIONS } from "@/features/demand/constants";
import {
  fetchProvinceOptions,
  fetchWardOptions,
  findByName,
  geoApi,
  goongApi,
  useProvinceOptions,
} from "@/features/geo";
import { useActiveProcessingServices } from "@/features/processing-service";
import { useActiveProductGroups } from "@/features/product-group";
import {
  EMPTY_SEARCH_FILTER_VALUES,
  toSearchParams,
  type FilterValues,
} from "../search-filter-utils";
import { searchSession } from "../search-session";
import {
  SectionCard,
  SelectedBadge,
  TileImage,
  WizardFooter,
} from "./wizard-ui";

const STORE_KEY = "member:form";
const fold = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();

const toggle = (list: string[], v: string) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

interface Props {
  step: 1 | 2;
  searching?: boolean;
  onNext: () => void;
  onSearch: (params: FactorySearchParams, values: FilterValues) => void;
}

/** Mobile-app search form split into 2 steps (nông sản → dịch vụ) */
export function MobileSearchWizard({
  step,
  searching,
  onNext,
  onSearch,
}: Props) {
  const { toast } = useToast();
  const form = useForm<FilterValues>({
    defaultValues: {
      ...EMPTY_SEARCH_FILTER_VALUES,
      ...searchSession.read<Partial<FilterValues>>(STORE_KEY),
    },
  });

  const saveDraft = () => {
    searchSession.write(STORE_KEY, form.getValues());
    toast({
      title: "Đã lưu nháp",
      description: "Thông tin tìm kiếm được giữ lại.",
    });
  };

  const submit = form.handleSubmit((v) => {
    searchSession.write(STORE_KEY, v);
    onSearch(toSearchParams(v), v);
  });

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="relative">
        {step === 1 ? (
          <>
            <StepTitle>
              Thông tin nông sản
              <br />
              cần chế biến
            </StepTitle>
            <div className="space-y-4">
              <CropPicker control={form.control} />
              <QuantityCard control={form.control} />
              <LocationCard control={form.control} setValue={form.setValue} />
            </div>
            <WizardFooter>
              <button
                type="button"
                onClick={saveDraft}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white text-base font-semibold text-slate-800 shadow-sm active:scale-[0.98]"
              >
                <FileText className="h-5 w-5" /> Lưu nháp
              </button>
              <button
                type="button"
                onClick={() => {
                  searchSession.write(STORE_KEY, form.getValues());
                  onNext();
                }}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#14532d] text-base font-semibold text-white shadow-lg shadow-emerald-900/25 active:scale-[0.98]"
              >
                Tiếp tục <ArrowRight className="h-5 w-5" />
              </button>
            </WizardFooter>
          </>
        ) : (
          <>
            <StepTitle>Chọn dịch vụ chế biến</StepTitle>
            <div className="space-y-6">
              <ServicePicker control={form.control} />
              <div>
                <h3 className="mb-2 text-base font-bold text-slate-900">
                  Yêu cầu kỹ thuật chi tiết
                </h3>
                <TextareaField
                  control={form.control}
                  name="technicalRequirement"
                  label={
                    <span className="sr-only">Yêu cầu kỹ thuật chi tiết</span>
                  }
                  rows={2}
                  placeholder="Ví dụ: sấy lạnh nhiệt độ thấp, đóng gói 500g/túi..."
                />
              </div>
              <CertificatePicker control={form.control} />
              <MoreRequirements control={form.control} />
            </div>
            <WizardFooter>
              <button
                type="button"
                onClick={submit}
                disabled={searching}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#14532d] text-base font-semibold text-white shadow-lg shadow-emerald-900/25 active:scale-[0.98] disabled:opacity-70"
              >
                {searching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Tìm nhà máy phù hợp <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </WizardFooter>
          </>
        )}
      </form>
    </Form>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mb-5 mt-1">
      <Leaf
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-6 h-24 w-24 rotate-12 text-emerald-800/[0.08]"
      />
      <h1 className="relative text-[1.75rem] font-extrabold leading-tight tracking-tight text-[#0f3d22]">
        {children}
      </h1>
    </div>
  );
}

// ─── Step 1 ─────────────────────────────────────────────────────────

function CropPicker({ control }: { control: Control<FilterValues> }) {
  const { field } = useController({ control, name: "crops" });
  const selected: string[] = field.value ?? [];
  const [keyword, setKeyword] = useState("");
  const { data: groups = [], isLoading } = useActiveProductGroups();

  // Crops come from product groups; a crop shows its group's image
  const crops = useMemo(() => {
    const map = new Map<
      string,
      { name: string; group: string; imageUrl?: string | null }
    >();
    for (const g of groups)
      for (const c of g.crops ?? [])
        if (!map.has(c))
          map.set(c, { name: c, group: g.name, imageUrl: g.imageUrl });
    return [...map.values()];
  }, [groups]);

  const visible = useMemo(() => {
    const k = fold(keyword.trim());
    return k
      ? crops.filter(
          (c) => fold(c.name).includes(k) || fold(c.group).includes(k),
        )
      : crops;
  }, [crops, keyword]);

  return (
    <SectionCard icon={<Leaf className="h-5 w-5" />} title="1. Loại nông sản">
      <label className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15">
        <Search className="h-5 w-5 shrink-0 text-slate-500" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm nông sản (sầu riêng, xoài...)"
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-slate-400"
        />
      </label>

      <div className="-mx-4 mt-2 flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isLoading
          ? Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="h-24 w-[4.5rem] shrink-0 animate-pulse rounded-2xl bg-slate-100"
              />
            ))
          : visible.map((c) => {
              const on = selected.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => field.onChange(toggle(selected, c.name))}
                  className={`relative flex w-[4.5rem] shrink-0 snap-start flex-col items-center gap-1 rounded-2xl p-1.5 pb-2 transition ${
                    on
                      ? "bg-emerald-50 ring-2 ring-[#1f7a45]"
                      : "bg-slate-50 ring-1 ring-slate-200/70"
                  }`}
                >
                  <TileImage
                    src={c.imageUrl}
                    alt={c.name}
                    className="h-14 w-14 rounded-xl"
                  />
                  <span className="line-clamp-2 text-center text-xs font-medium leading-tight text-slate-800">
                    {c.name}
                  </span>
                  {on && <SelectedBadge />}
                </button>
              );
            })}
        {!isLoading && visible.length === 0 && (
          <p className="py-6 text-sm text-slate-500">
            Không tìm thấy nông sản phù hợp.
          </p>
        )}
      </div>
      {selected.length > 0 && (
        <p className="mt-2 text-xs text-emerald-800">
          Đã chọn: {selected.join(", ")}
        </p>
      )}
    </SectionCard>
  );
}

const UNITS = [
  { value: "KG_PER_MONTH", label: "kg" },
  { value: "TONNE_PER_MONTH", label: "Tấn" },
] as const;

function QuantityCard({ control }: { control: Control<FilterValues> }) {
  const qty = useController({ control, name: "maxCapacity" });
  const unit = useController({ control, name: "capacityUnit" });
  return (
    <SectionCard icon={<Boxes className="h-5 w-5" />} title="2. Số lượng">
      <div className="flex gap-2">
        <label className="flex h-12 min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={qty.field.value ?? ""}
            onChange={(e) =>
              qty.field.onChange(
                e.target.value === "" ? undefined : e.target.valueAsNumber,
              )
            }
            placeholder="Nhập số lượng"
            className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-slate-400"
          />
          <span className="pl-2 text-sm text-slate-500">/tháng</span>
        </label>
        <div
          className="flex rounded-xl bg-slate-100 p-1"
          role="radiogroup"
          aria-label="Đơn vị"
        >
          {UNITS.map((u) => {
            const on = unit.field.value === u.value;
            return (
              <button
                key={u.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => unit.field.onChange(u.value)}
                className={`min-w-14 rounded-lg px-3 text-sm font-semibold transition ${
                  on ? "bg-[#14532d] text-white shadow" : "text-slate-600"
                }`}
              >
                {u.label}
              </button>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}

function LocationCard({
  control,
  setValue,
}: {
  control: Control<FilterValues>;
  setValue: ReturnType<typeof useForm<FilterValues>>["setValue"];
}) {
  const { toast } = useToast();
  const provinceName = useWatch({ control, name: "province" });
  const { provinces } = useProvinceOptions();
  const currentProvince = useMemo(
    () =>
      provinces.find(
        (p) => p.name === provinceName || p.fullName === provinceName,
      ),
    [provinces, provinceName],
  );
  const provinceCode = currentProvince?.code;
  const fetchWards = useCallback(
    (k: string) =>
      provinceCode ? fetchWardOptions(provinceCode, k) : Promise.resolve([]),
    [provinceCode],
  );

  // Picking a ward from GPS sets both at once — don't clear it on that province change
  const skipWardReset = useRef(false);
  const prevProvince = useRef(provinceName);
  useEffect(() => {
    if (prevProvince.current !== provinceName && !skipWardReset.current)
      setValue("ward", "");
    skipWardReset.current = false;
    prevProvince.current = provinceName;
  }, [provinceName, setValue]);

  const [locating, setLocating] = useState(false);
  const locateMe = () => {
    if (!navigator.geolocation) {
      toast({ title: "Thiết bị không hỗ trợ định vị", variant: "destructive" });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const place = await goongApi.reverseGeocode(
            coords.latitude,
            coords.longitude,
          );
          const province =
            place && findByName(provinces, place.compound.province);
          if (!province) throw new Error();
          let wardName = "";
          try {
            const wards =
              (await geoApi.getWards({ provinceCode: province.code }))
                .content ?? [];
            wardName = findByName(wards, place.compound.commune)?.name ?? "";
          } catch {
            // province alone is still useful
          }
          skipWardReset.current = province.name !== provinceName;
          setValue("province", province.name);
          setValue("ward", wardName);
        } catch {
          toast({
            title: "Không xác định được vị trí",
            description: "Vui lòng chọn tỉnh/thành thủ công.",
            variant: "destructive",
          });
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        toast({
          title: "Chưa cấp quyền vị trí",
          description: "Hãy cho phép truy cập vị trí hoặc chọn thủ công.",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  return (
    <SectionCard icon={<MapPin className="h-5 w-5" />} title="3. Địa điểm">
      <div className="grid grid-cols-2 gap-2 [&_label]:sr-only">
        <AsyncSearchSelectField
          control={control}
          name="province"
          label="Tỉnh/thành"
          fetchOptions={fetchProvinceOptions}
          placeholder="Chọn tỉnh/thành"
          clearable
        />
        <AsyncSearchSelectField
          key={provinceCode ?? "none"}
          control={control}
          name="ward"
          label="Xã/phường"
          fetchOptions={fetchWards}
          disabled={!currentProvince}
          placeholder={provinceName ? "Chọn xã/phường" : "Chọn tỉnh trước"}
          clearable
        />
      </div>
      <button
        type="button"
        onClick={locateMe}
        disabled={locating}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 text-[15px] font-semibold text-[#14532d] active:scale-[0.99] disabled:opacity-70"
      >
        {locating ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <LocateFixed className="h-5 w-5" />
        )}
        Dùng vị trí hiện tại
      </button>
      <p className="mt-2 text-xs text-slate-500">
        Để trống để tìm trên toàn quốc.
      </p>
    </SectionCard>
  );
}

// ─── Step 2 ─────────────────────────────────────────────────────────

function ServicePicker({ control }: { control: Control<FilterValues> }) {
  const { field } = useController({ control, name: "processingServiceIds" });
  const selected: string[] = field.value ?? [];
  const { data: services = [], isLoading } = useActiveProcessingServices();

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {isLoading
        ? Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-100"
            />
          ))
        : services.map((s) => {
            const id = String(s.id);
            const on = selected.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => field.onChange(toggle(selected, id))}
                className={`relative overflow-hidden rounded-2xl bg-white text-left transition ${
                  on
                    ? "ring-2 ring-[#1f7a45] shadow-md shadow-emerald-900/10"
                    : "ring-1 ring-slate-200"
                }`}
              >
                <TileImage
                  src={s.imageUrl}
                  alt={s.name}
                  className="aspect-[4/3] w-full"
                />
                <span className="line-clamp-2 block min-h-[2.75rem] px-2 py-1.5 text-[13px] font-semibold leading-tight text-slate-800">
                  {s.name}
                </span>
                {on && <SelectedBadge />}
              </button>
            );
          })}
      {!isLoading && services.length === 0 && (
        <p className="col-span-3 py-6 text-center text-sm text-slate-500">
          Chưa có dịch vụ chế biến.
        </p>
      )}
    </div>
  );
}

function CertificatePicker({ control }: { control: Control<FilterValues> }) {
  const { field } = useController({ control, name: "certificateTypes" });
  const selected: string[] = field.value ?? [];
  const { data: certs = [] } = useQuery({
    queryKey: ["master-certificates", "wizard-options"],
    queryFn: () => fetchMasterCertificateOptions(""),
    staleTime: 60_000,
  });

  const chip = (
    key: string,
    label: string,
    on: boolean,
    icon: React.ReactNode,
    onClick: () => void,
  ) => (
    <button
      key={key}
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`relative flex w-[4.75rem] shrink-0 snap-start flex-col items-center gap-1.5 rounded-2xl px-1 py-2.5 transition ${
        on
          ? "bg-emerald-50 ring-2 ring-[#1f7a45]"
          : "bg-white ring-1 ring-slate-200"
      }`}
    >
      {icon}
      <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight text-slate-700">
        {label}
      </span>
      {on && <SelectedBadge />}
    </button>
  );

  return (
    <div>
      <h3 className="mb-2 text-base font-bold text-slate-900">
        Yêu cầu chứng nhận
      </h3>
      <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {certs.map((c) =>
          chip(
            c.value,
            c.label,
            selected.includes(c.value),
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-[#14532d] text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>,
            () => field.onChange(toggle(selected, c.value)),
          ),
        )}
        {chip(
          "none",
          "Không yêu cầu",
          selected.length === 0,
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Ban className="h-5 w-5" />
          </span>,
          () => field.onChange([]),
        )}
      </div>
    </div>
  );
}

function MoreRequirements({ control }: { control: Control<FilterValues> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-white/80 ring-1 ring-slate-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-3"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#14532d]">
          <FlaskConical className="h-5 w-5" />
        </span>
        <span className="flex-1 text-left text-[15px] font-semibold text-slate-800">
          Yêu cầu khác (nguyên liệu, đóng gói, lời nhắn)
        </span>
        <ChevronDown
          className={`h-5 w-5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="space-y-3 border-t border-slate-100 p-3">
          <SelectField
            control={control}
            name="materialCondition"
            label="Tình trạng nguyên liệu"
            options={MATERIAL_CONDITION_OPTIONS}
            placeholder="Chọn tình trạng"
          />
          <TextareaField
            control={control}
            name="packagingRequirement"
            label="Yêu cầu đóng gói"
            rows={2}
            placeholder="VD: Túi hút chân không 500g"
          />
          <TextareaField
            control={control}
            name="message"
            label="Lời nhắn"
            rows={2}
            placeholder="VD: Giao hàng trong ngày..."
          />
        </div>
      )}
    </div>
  );
}
