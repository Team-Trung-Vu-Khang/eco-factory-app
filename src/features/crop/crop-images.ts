import cinnamon from "@/assets/crops/cinnamon.jpg";
import coffee from "@/assets/crops/coffee.jpg";
import corn from "@/assets/crops/corn.jpg";
import durian from "@/assets/crops/durian.jpg";
import ginseng from "@/assets/crops/ginseng.jpg";
import longan from "@/assets/crops/longan.jpg";
import mango from "@/assets/crops/mango.jpg";
import orange from "@/assets/crops/orange.jpg";
import pineapple from "@/assets/crops/pineapple.jpg";
import rice from "@/assets/crops/rice.jpg";
import tea from "@/assets/crops/tea.jpg";
import tomato from "@/assets/crops/tomato.jpg";

// Tên cây trồng là text tự do từ master data nhóm nông sản → khớp theo từ khóa.
// Thứ tự quan trọng: "cà chua"/"cà phê" phải đứng trước các từ ngắn hơn.
const KEYWORD_IMAGES: [keywords: string[], image: string][] = [
  [["sầu riêng"], durian],
  [["xoài"], mango],
  [["dứa", "thơm"], pineapple],
  [["cà phê"], coffee],
  [["cà chua"], tomato],
  [["chè", "trà"], tea],
  [["nhãn"], longan],
  [["cam", "quýt", "bưởi"], orange],
  [["lúa", "gạo"], rice],
  [["ngô", "bắp"], corn],
  [["sâm"], ginseng],
  [["quế"], cinnamon],
];

/** Ảnh minh họa theo tên cây trồng; không khớp trả về undefined để UI dùng icon. */
export const getCropImage = (cropName: string): string | undefined => {
  const words = ` ${cropName.toLowerCase()} `;
  return KEYWORD_IMAGES.find(([keys]) => keys.some((k) => words.includes(` ${k}`)))?.[1];
};
