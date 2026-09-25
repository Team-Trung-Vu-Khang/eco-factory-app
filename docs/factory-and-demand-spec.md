# MEVI Factories – Đặc tả dữ liệu: Hồ sơ nhà máy & Nhu cầu chế biến

Nguồn: Logframe WE4Ag (Kết quả 2 / Kết quả đầu ra 2.1) + bảng trường thông tin do dự án cung cấp.

## 1. Bối cảnh & chỉ số

| Chỉ số (logframe) | Mục tiêu | Dữ liệu trong app dùng để tính |
|---|---|---|
| Nhà máy / cơ sở chế biến đăng ký trên MEVI Factories (KQĐR 2.1) | 300 | `Factory.isKpiEligible` |
| Nữ chủ DN tiếp cận được cơ sở chế biến (KQ 2) | 50 | `Demand.kpi.hasViewedFactory` / `hasFactoryResponse` + `Requester.gender = FEMALE` |
| Nữ chủ DN ứng dụng kỹ thuật chế biến cải tiến (KQ 2) | 500 | Ngoài phạm vi tài liệu này |
| Sản phẩm nông nghiệp được phát triển (KQ 2) | 20 | Ngoài phạm vi tài liệu này |

Hoạt động liên quan:
- 2.1.1: Phát triển MEVI Factories để kết nối thành viên MEVI Farms với cơ sở chế biến gần đó → **matching Nhu cầu ↔ Nhà máy theo vị trí, dịch vụ, nông sản, công suất, chứng nhận**.
- 2.1.2: Thu hút doanh nghiệp chưa dùng hết công suất → **trường công suất khả dụng cho bên ngoài là trường KPI cốt lõi**.

Sidebar tương ứng: `Nhà máy › Hồ sơ nhà máy` và `Nhu cầu › Thông tin nhu cầu`.

## 2. Danh mục dùng chung (enum)

| Enum | Giá trị (code → nhãn) |
|---|---|
| `OrganizationType` | `HOUSEHOLD_BUSINESS` Hộ kinh doanh · `COOPERATIVE_GROUP` Tổ hợp tác · `COOPERATIVE` HTX · `ENTERPRISE` Doanh nghiệp · `RESEARCH_INSTITUTE` Viện nghiên cứu · `UNIVERSITY` Trường ĐH-CĐ · `RESEARCH_CENTER` Trung tâm nghiên cứu-ứng dụng |
| `Gender` | `FEMALE` Nữ · `MALE` Nam · `OTHER` Khác |
| `ProductGroup` | Master data: chè, rau củ, trái cây, dược liệu, ngũ cốc, … (quản lý qua API danh mục, không hard-code) |
| `ProcessingService` | `PRE_PROCESSING` Sơ chế · `WASHING` Rửa · `SORTING` Phân loại · `DRYING` Sấy · `GRINDING` Nghiền · `PRESSING` Ép · `FERMENTING` Lên men · `STORAGE` Bảo quản · `PACKAGING` Đóng gói · `OTHER` Khác |
| `CapacityUnit` | `KG_PER_HOUR` · `KG_PER_DAY` · `TON_PER_DAY` · `BATCH_PER_DAY` · `OTHER` |
| `MachineStatus` | `ACTIVE` Đang hoạt động · `MAINTENANCE` Bảo trì · `PAUSED` Tạm dừng |
| `CertificationType` | `FOOD_SAFETY` ATTP · `HACCP` · `ISO` · `GMP` · `OTHER` Khác |
| `MaterialCondition` | `FRESH` Tươi · `DRIED` Khô · `SEMI_FINISHED` Bán thành phẩm · `OTHER` |
| `QuantityUnit` | `KG` · `TON` · `LOT` Lô · `BATCH` Mẻ · `OTHER` |
| `SearchScope` | `SAME_PROVINCE` Cùng tỉnh · `NEIGHBOR_PROVINCES` Tỉnh lân cận · `NATIONWIDE` Toàn quốc · `OTHER` |
| `DemandStatus` | xem mục 4.3 |

Địa giới hành chính: 2 cấp **Tỉnh/Thành phố → Xã/Phường** (theo địa giới mới, không có cấp huyện).

## 3. Hồ sơ nhà máy (`Factory`)

Ký hiệu cột Bắt buộc: **Có** · **Không** · **Nên có** (không chặn lưu, nhưng trừ điểm hoàn thiện) · **ĐK** (bắt buộc theo điều kiện) · **HT** (hệ thống tự tính, người dùng không nhập).

### 3.1 Thông tin cơ bản

| Trường | Key | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Tên cơ sở chế biến / nhà máy | `name` | string | Có | Tên hiển thị trên MEVI Factories |
| Loại hình hoạt động | `organizationType` | `OrganizationType` | Có | Phân loại cơ sở |
| Mã số thuế | `taxCode` | string | Không* | *Bảng gốc ghi "Không" nhưng ghi chú "Bắt buộc" → cần chốt (xem mục 6) |
| Năm thành lập / bắt đầu hoạt động | `foundedYear` | number | Không | 1900 ≤ x ≤ năm hiện tại |

### 3.2 Người đại diện (`representative`)

| Trường | Key | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Họ và tên | `fullName` | string | Có | |
| Giới tính | `gender` | `Gender` | Có | Thống kê dự án (doanh nghiệp do nữ làm chủ) |
| Số điện thoại | `phone` | string (VN phone) | Có | |
| Email | `email` | string (email) | Không | |

### 3.3 Địa điểm (`location`)

| Trường | Key | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Tỉnh/Thành phố | `provinceCode` | string | Có | Tìm kiếm theo vị trí |
| Xã/Phường | `wardCode` | string | Có | Phụ thuộc tỉnh |
| Địa chỉ chi tiết | `address` | string | Có | |
| Vị trí bản đồ | `latitude`, `longitude` | number | Nên có | Hiển thị bản đồ, tính khoảng cách (Goong) |

### 3.4 Thông tin hoạt động

| Trường | Key | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Nhóm nông sản đang chế biến | `productGroupIds` | string[] | Có (≥1) | |
| Dịch vụ chế biến cung cấp | `services` | `ProcessingService[]` | Có (≥1) | |
| Mô tả ngắn | `description` | string | Có | Giới thiệu năng lực |

### 3.5 Máy móc & công suất

| Trường | Key | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Có năng lực cung cấp cho bên ngoài? | `offersExternalCapacity` | boolean | Có | **Trường KPI cốt lõi** |
| Danh sách máy / dây chuyền | `machines` | `Machine[]` | ĐK: ≥1 nếu `offersExternalCapacity = true` | Cho phép nhiều máy |

`Machine`:

| Trường | Key | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Tên máy / dây chuyền | `name` | string (hoặc chọn từ danh mục) | Có | |
| Chức năng | `functions` | `ProcessingService[]` | Có (≥1) | |
| Loại nông sản phù hợp | `productGroupIds` | string[] | Có (≥1) | |
| Công suất tối đa | `maxCapacity` | number > 0 | Có | |
| Đơn vị công suất | `capacityUnit` | `CapacityUnit` | Có | |
| Công suất cung cấp cho bên ngoài | `availableCapacity` | number ≥ 0 | Có | ≤ `maxCapacity`, cùng đơn vị |
| Thời gian có thể nhận chế biến | `availableFrom`, `availableTo` | date | Không | Dùng cho matching |
| Tình trạng máy | `status` | `MachineStatus` | Có | |

### 3.6 Chứng nhận

| Trường | Key | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Có chứng nhận? | `hasCertification` | boolean | Không | |
| Danh sách chứng nhận | `certifications` | `Certification[]` | Không | Hiện khi `hasCertification = true` |

`Certification`: `type` (`CertificationType`, dùng cho bộ lọc) · `number` · `issuedDate` · `expiryDate` (≥ `issuedDate`) · `issuer` · `files` (upload, bằng chứng).

### 3.7 Hình ảnh

| Trường | Key | Kiểu | Bắt buộc |
|---|---|---|---|
| Ảnh đại diện cơ sở | `avatarUrl` | image | Nên có |
| Ảnh khu vực chế biến | `facilityPhotos` | image[] | Không |
| Ảnh máy móc / dây chuyền | `machinePhotos` | image[] | Không |

### 3.8 Trạng thái hệ thống (HT – chỉ đọc)

| Trường | Key | Kiểu | Cách tính |
|---|---|---|---|
| Hồ sơ đã hoàn thiện | `completionPercent`, `isProfileComplete` | number, boolean | % trường Có/Nên có đã điền; `isProfileComplete` = đủ mọi trường Có |
| Có công suất khả dụng | `hasAvailableCapacity` | boolean | `offersExternalCapacity` && ∃ máy `status = ACTIVE` và `availableCapacity > 0` |
| Đủ điều kiện tính chỉ số 300 cơ sở | `isKpiEligible` | boolean | Đề xuất: `isProfileComplete && hasAvailableCapacity` (cần chốt, mục 6) |
| Ngày đạt đủ điều kiện | `kpiEligibleAt` | timestamp | Ghi lần đầu chuyển sang `true`, không ghi đè (audit / M&E) |

## 4. Nhu cầu chế biến (`Demand`)

### 4.1 Thông tin người có nhu cầu (`requester`)

| Trường | Key | Kiểu | Bắt buộc* |
|---|---|---|---|
| Họ và tên | `fullName` | string | Có |
| Giới tính | `gender` | `Gender` | Có |
| Tên đơn vị / nông hộ / HTX | `organizationName` | string | Có |
| Số điện thoại | `phone` | string | Có |
| Tỉnh/Thành phố | `provinceCode` | string | Có |

*Bảng gốc để trống cột Bắt buộc; đề xuất lấy sẵn từ profile MEVI Farms và bắt buộc vì cần cho KPI "Profile đã hoàn thiện".

### 4.2 Nội dung nhu cầu

| Nhóm | Trường | Key | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|---|
| Xác nhận | Hiện có nhu cầu tìm cơ sở bảo quản/chế biến? | `hasDemand` | boolean | Có | **Trường KPI cốt lõi** |
| Sản phẩm | Nhóm nông sản | `productGroupId` | string | Có | |
| | Tên sản phẩm cụ thể | `productName` | string | Có | VD: chè Shan tuyết, bưởi, dứa |
| | Tình trạng nguyên liệu | `materialCondition` | `MaterialCondition` | Không | Hỗ trợ matching |
| | Khối lượng cần chế biến | `quantity` | number > 0 | Có | |
| | Đơn vị | `quantityUnit` | `QuantityUnit` | Có | |
| Loại nhu cầu | Dịch vụ cần thực hiện | `services` | `ProcessingService[]` | Có (≥1) | |
| | Yêu cầu kỹ thuật đặc biệt | `technicalRequirements` | text | Không | |
| | Yêu cầu đóng gói | `packagingRequirements` | text | Không | |
| | Yêu cầu chứng nhận của cơ sở | `requiredCertifications` | `CertificationType[]` | Không | Lọc nhà máy |
| Thời gian & địa điểm | Thời gian cần chế biến | `neededFrom`, `neededTo` | date | Có (`neededFrom`) | `neededTo` ≥ `neededFrom` |
| | Địa điểm nguyên liệu | `materialLocation` { `provinceCode`, `wardCode`, `address`, `latitude?`, `longitude?` } | object | Có | Tìm cơ sở gần |
| | Phạm vi tìm cơ sở | `searchScope` | `SearchScope` | Không | Mặc định `SAME_PROVINCE` |
| Bổ sung | Ảnh nguyên liệu / sản phẩm | `materialPhotos` | image[] | Không | Hỗ trợ nhà máy đánh giá |
| | File tài liệu | `attachments` | file[] | Không | |
| | Ghi chú | `note` | text | Không | |

### 4.3 Trạng thái & funnel (HT)

```
DRAFT (Mới tạo) → SEARCHING (Đang tìm cơ sở) → SENT (Đã gửi nhu cầu)
  → RESPONDED (Đã có phản hồi) → NEGOTIATING (Đang trao đổi)
  → CONNECTED (Đã kết nối) → COMPLETED (Đã hoàn thành)
Mọi trạng thái chưa COMPLETED → CANCELLED (Hủy)
```

| Trường | Key | Kiểu | Cách tính |
|---|---|---|---|
| Trạng thái | `status` | `DemandStatus` | Theo luồng trên |
| Ngày tạo | `createdAt` | timestamp | |
| Số cơ sở đã xem | `viewedFactoryCount` | number | Đếm nhà máy **khác nhau** người dùng mở chi tiết → chỉ số tiếp cận |
| Số cơ sở đã gửi nhu cầu | `sentFactoryCount` | number | |
| Số cơ sở đã phản hồi | `respondedFactoryCount` | number | → chỉ số kết nối thành công |

### 4.4 Điều kiện KPI (HT)

| Điều kiện | Key | Cách tính |
|---|---|---|
| Profile đã hoàn thiện | `kpi.isProfileComplete` | Đủ các trường mục 4.1 |
| Đã xác nhận có nhu cầu | `kpi.hasConfirmedDemand` | `hasDemand = true` |
| Đã xem ≥ 1 cơ sở | `kpi.hasViewedFactory` | `viewedFactoryCount ≥ 1` → tính **"đã tiếp cận"** |
| Có ≥ 1 cơ sở phản hồi | `kpi.hasFactoryResponse` | `respondedFactoryCount ≥ 1` → tính **"kết nối thành công"** |

Mỗi cờ nên lưu kèm timestamp lần đầu đạt (`…At`) để phục vụ báo cáo M&E theo kỳ.

## 5. Matching Nhu cầu ↔ Nhà máy (gợi ý)

Lọc cứng: nhà máy `hasAvailableCapacity`; `services` giao với `machines[].functions`; `productGroupId` ∈ `machines[].productGroupIds`; đủ `requiredCertifications` (chứng nhận còn hạn); nằm trong `searchScope`.
Xếp hạng: khoảng cách (GPS) → khung thời gian máy rảnh trùng `neededFrom–neededTo` → công suất khả dụng đủ đáp ứng `quantity` (cần quy đổi đơn vị).

## 6. Câu hỏi cần chốt

1. `taxCode` bắt buộc hay không? (bảng ghi mâu thuẫn "Không" / "Bắt buộc")
2. Công thức chính xác của `isKpiEligible` (300 cơ sở): chỉ cần hồ sơ hoàn thiện, hay bắt buộc có công suất khả dụng / đã xác minh bởi admin?
3. Hồ sơ nhà máy có cần bước **duyệt** của admin trước khi hiển thị và tính KPI không?
4. Chỉ số "50 nữ chủ DN tiếp cận được cơ sở chế biến" tính theo "đã xem ≥1 cơ sở" hay "có ≥1 phản hồi"?
5. Nhu cầu do người dùng MEVI Farms tạo (liên thông tài khoản) hay nhập trực tiếp trên MEVI Factories?
6. Quy đổi đơn vị giữa `QuantityUnit` (lô, mẻ) và `CapacityUnit` để so công suất — có bảng quy đổi không?
7. Danh mục `ProductGroup` và tên máy dùng chung master data với MEVI Farms?
