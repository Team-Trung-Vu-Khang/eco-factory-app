import { useCurrentFactory, useFactoryOptions } from "@/features/factory";
import { useIsFactoryAdmin } from "@/features/viewer";

/**
 * Factory scope for schedule lists.
 * Admin: every factory, narrowed by the "Nhà máy" filter · factory: its own posts only.
 */
export function useFactoryFilter() {
  const isAdmin = useIsFactoryAdmin();
  const { options } = useFactoryOptions();
  const { factoryId: ownFactoryId } = useCurrentFactory();
  return {
    isAdmin,
    filter: { key: "factoryId", label: "Nhà máy", options },
    /** factoryId to query with, given the admin's filter selection */
    scope: (selected?: string) => (isAdmin ? selected : ownFactoryId),
  };
}
