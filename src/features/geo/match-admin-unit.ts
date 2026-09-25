/** "Thành phố Hà Nội" / "TP. Hà Nội" / "Ha Noi" → "ha noi" */
export function normalizeAdminName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/^(thanh pho|tinh|tp\.?|phuong|xa|thi tran|dac khu)\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function findByName<T extends { name: string }>(items: T[], name?: string): T | undefined {
  if (!name) return undefined;
  const target = normalizeAdminName(name);
  return items.find((i) => normalizeAdminName(i.name) === target);
}
