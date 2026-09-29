import { useFactoryOptions } from "@/features/factory";

/** "Nhà máy" DataTable filter — admin views span every factory */
export function useFactoryFilter() {
  const { options } = useFactoryOptions();
  return { filter: { key: "factoryId", label: "Nhà máy", options } };
}
