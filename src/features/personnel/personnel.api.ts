import { keepPreviousData, useQuery } from "@tanstack/react-query";

export interface Personnel {
  id: string;
  fullName: string;
  position?: string;
  phone?: string;
  avatarUrl?: string;
}

// TODO: replace with the personnel API of the current workspace
const MOCK_PERSONNEL: Personnel[] = [
  { id: "p1", fullName: "Nguyễn Văn An", position: "Trưởng kho", phone: "0912000111" },
  { id: "p2", fullName: "Lê Thị Bình", position: "Thủ kho", phone: "0987222333" },
  { id: "p3", fullName: "Trần Văn Cường", position: "Kỹ thuật viên" },
  { id: "p4", fullName: "Phạm Thị Dung", position: "Quản đốc", phone: "0903444555" },
  { id: "p5", fullName: "Hoàng Văn Em", position: "Nhân viên vận hành" },
  { id: "p6", fullName: "Đỗ Thị Giang", position: "Kế toán kho", phone: "0977666888" },
];

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();

export const personnelApi = {
  async search(keyword: string): Promise<Personnel[]> {
    await new Promise((r) => setTimeout(r, 250));
    const q = normalize(keyword.trim());
    return MOCK_PERSONNEL.filter(
      (p) => !q || normalize(`${p.fullName} ${p.position ?? ""} ${p.phone ?? ""}`).includes(q),
    );
  },
};

export function usePersonnelSearch(keyword: string, enabled = true) {
  return useQuery({
    queryKey: ["personnel", "search", keyword],
    queryFn: () => personnelApi.search(keyword),
    enabled,
    placeholderData: keepPreviousData,
  });
}
