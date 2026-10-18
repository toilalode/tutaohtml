# Tổng Hợp Kiếm Pháp 3D — hướng dẫn chạy (không màn hình đen)
Game đã gói sẵn three.js trong `lib/` nên KHÔNG cần Internet.

## Cấu trúc file
- `index.html` — khung giao diện (HUD, nút, popup...), nạp các file dưới theo đúng thứ tự.
- `skills.js`, `beasts.js` — bảng chiêu và mô hình bốn thú Tứ Tượng.
- `rule.js` — menu Quy Luật Kiếm Hồn (Vạn Kiếm, Thiên Trảm, Áp Chế), nạp **trước** `game.js`.
- `game.js` — lõi game: nhân vật, quái, chiêu thức, điều khiển, hướng dẫn trong game.
- `zoom.js` — thu phóng camera, Tâm (shift-lock), sát thương liên tục trong Lãnh Địa, nút Tấn công ở map Test, bố cục hai cột nút; nạp **sau** `game.js`.
- `lib/three.min.js` — thư viện 3D, chạy offline.
- `sw.js` — service worker, cho phép cài game như app và chạy không mạng.

## Cách 1 (khuyên dùng): localhost
1. Giải nén zip, mở terminal trong thư mục `thienmenh`.
2. Chạy:  `python3 -m http.server 8000`
3. Mở trình duyệt: http://localhost:8000
Điện thoại khác máy: cùng Wi-Fi, mở http://IP-máy:8000 (xem IP bằng `ifconfig` / `ip a`).
Termux: `pkg install python` → `cd thienmenh` → `python -m http.server 8000` → mở Chrome http://localhost:8000

## Cách 2: không có Python
`npx serve .`  hoặc  `npx http-server -p 8000`

## Nếu màn hình đen
- Phải mở `index.html` TRONG thư mục có `lib/three.min.js` (đừng tách file ra).
- Lệnh server phải chạy ngay trong thư mục `thienmenh` (có file index.html).
- Bật WebGL / tăng tốc phần cứng trong trình duyệt. Thử Chrome mới nhất.
- Ctrl+Shift+R để xoá cache; xem Console (F12) để biết file nào lỗi 404.
- Trang hiện dòng chữ đỏ báo thiếu three.min.js nếu đường dẫn sai.

## Lưu game (localStorage)
Tự lưu mỗi 2 giây: kiếm, kiếm pháp, quy luật đã chọn, kỷ lục đợt. Xoá lưu: mở Console gõ `resetSave()`.
(localStorage gắn theo địa chỉ: localhost:8000 và IP-máy:8000 là 2 bộ lưu riêng.)

## Điều khiển
WASD, Space nhảy, **Q lướt**, **E đỡ đòn (giữ)**, Z X C V B N M J chiêu, F chung chương, G chung cực áo nghĩa, 1 kiếm pháp, 2 kiếm, R T Y U buff (bật/tắt, không hồi chiêu), **H = M2** quy luật.
**M1 = chạm/bấm vào màn hình** (chạm nhanh = 1 đòn, giữ yên = đánh liên tục, kéo = xoay camera). Chuột trái = M1, chuột phải = M2. Tab vẫn là M1.
Cảm ứng: joystick trái, nút phải (Q / Nhảy / E / M2), kéo bên phải để xoay camera. Kéo ngón tay từ chỗ khác vào nút thì KHÔNG tính là bấm nút.
Tự hồi máu: 2 HP/giây sau 3 giây không bị đánh. Chữ thi triển hiện ngay trên hàng nút chiêu 3px.
Quy tắc buff: bật R thì cấm T, Y, U; bật T hoặc Y thì cấm R. T (Thiên Địa) không hấp thụ sát thương, chỉ Y (Xích Giáp) hấp thụ.
Cửu Ngũ Chí Tôn Kiếm: mọi chiêu (trừ Ngôn Xuất Pháp Tuỳ Thức) đều bay lên trời. Đệ Ngũ Thức Thái Cực ngưng động thời gian (quái đứng im).
Tứ Thánh: chọn kiếm pháp Tứ Tượng (phím 1) — Z/X Thanh Long, C Bạch Hổ, V/B Chu Tước, N Huyền Vũ, J/F cả bốn; Huyền Vũ tự đỡ đòn (đỡ liên tục, mỗi lần đỡ có 0,4 giây bất tử chống đòn dồn); Tứ Thánh Khí Tức tăng +500% sát thương Tứ Tượng.

### Thu phóng, xoay camera & Tâm (xem chiêu bao quanh)
- **Máy tính:** cuộn **chuột giữa** lên = phóng gần, xuống = thu xa (từ 3 đến 220, giữ phím cuộn mượt). Phím **O** phóng gần, phím **P** thu xa — giữ phím để zoom liên tục. Mũi tên **← → ↑ ↓** xoay camera. Phím **Shift** bật/tắt Tâm.
- **Điện thoại:** **chụm 2 ngón** trên khung cảnh (không đặt trên nút/joystick) để thu phóng; kéo 1 ngón nửa phải màn hình để xoay camera (xoay được trọn 360° cả ngang lẫn dọc).
- **Hàng nút dưới HUD Kiếm pháp/Kiếm (góc trên phải), cách HUD 10px:** `[🔒/🔓] [＋] [－]`, cỡ bằng nút Q (54×38). ＋ phóng gần, － thu xa, giữ nút để zoom liên tục. Hàng nút nằm trong khung HUD nên không bao giờ chèn lên HUD, kể cả điện thoại lẫn máy tính.
- **Tâm (kiểu Roblox shift-lock):** bật (🔒) hiện một **chấm trắng** cố định ở giữa màn hình (không còn vòng/vạch đỏ). Xoay camera thì **nhân vật tự xoay theo** hướng camera — đi ngang vẫn quay mặt về phía tâm. Chiêu sẽ đánh vào quái gần tâm nhất, trong góc ~34° phía trước mặt (tối đa 60 đơn vị); không có quái thì đánh thẳng về phía trước. Đang thi triển chiêu thì nhân vật quay mặt về mục tiêu như bình thường, không bị Tâm chi phối. Tắt (🔓) thì mọi thứ về như cũ.
- **Cột nút Q / Nhảy / E / M2 (cột phải):** lùi xuống 15px so với bản gốc, cỡ 54×38 bằng nút 1/2/?/Map, không còn bị thu nhỏ khi màn hình thấp — thay vào đó khoảng cách giữa các nút tự co hẹp trước (tối thiểu 1px) để không chèn HUD hay hàng chiêu; chỉ thu nhỏ nút khi đã hết cách.
- **Cột nút 1/2/?/Map (cột trái):** lùi xuống 15px, áp dụng cùng cách co giãn như cột phải.
- Zoom xa vẫn thấy nhân vật và chiêu: sương mù, bầu trời, mặt đất tự mở rộng; vòm Lãnh Địa tự trong hơn khi camera ra ngoài.
- Mã nằm trong `zoom.js` (nạp sau `game.js`).

### Lãnh Địa (Nhất Trảm Độc Tôn)
Thiên Mệnh Kiếm Pháp, phím G: mở Lãnh Địa, quái trong vực đứng im. Suốt lúc Lãnh Địa mở, mọi quái trong vực chịu sát thương liên tục mỗi 0,2 giây (không phụ thuộc Tâm hay mục tiêu). Ngay khi Lãnh Địa đóng (sau nhát chém cuối), toàn bộ quái trong vực chịu thêm đòn Vỡ Nát rất lớn kèm chớp vàng. Đổi map hoặc hồi sinh giữa chừng thì quái mới không dính đòn của Lãnh Địa cũ.

### Map Test
Nút 🗺 Map (dưới Hướng dẫn): chọn Map chính hoặc map Test. Map Test có 1 quái bù nhìn, ô sửa máu hiện tại/tối đa (nút Đặt, Đầy), và thanh máu trên đầu quái. Sát thương vừa gây hiện giữa màn hình trong 3,5 giây và cộng dồn.
Cạnh nút **Đầy** có thêm nút **Tấn công**: bấm để bật thì quái bù nhìn đứng yên tại chỗ (không di chuyển, không bị đánh lùi) và đánh bạn nếu bạn đứng trong tầm; bấm lại để quái trở về trạng thái choáng như mặc định.

## Màn hình ngang
Chạm màn hình "Chạm để vào game" → game vào toàn màn hình và khoá xoay ngang (Chrome Android). Nếu máy vẫn để dọc, giao diện tự xoay 90°. Muốn mở như app: menu Chrome ⋮ → "Thêm vào màn hình chính" (manifest.json đặt sẵn chế độ ngang toàn màn hình). Nhớ bật "Xoay tự động" của điện thoại để khoá ngang hoạt động tốt nhất.

## Cập nhật mới
- Tách phần Quy Luật Kiếm Hồn ra file riêng `rule.js` (nạp trước `game.js`).
- Thu phóng camera: con lăn chuột, phím O/P, chụm 2 ngón, nút ＋ － cùng cỡ nút Q, đặt dưới HUD Kiếm pháp/Kiếm.
- Tâm kiểu Roblox shift-lock: chấm trắng giữa màn hình, nhân vật xoay theo camera, phím Shift hoặc nút tròn 🔒/🔓 để bật/tắt.
- Lãnh Địa Nhất Trảm Độc Tôn gây sát thương liên tục trong lúc mở, thêm đòn Vỡ Nát khi đóng.
- Map Test có thêm nút Tấn công cho quái bù nhìn đứng yên tại chỗ và đánh người chơi.
- Cột nút Q/Nhảy/E/M2 và cột 1/2/?/Map lùi xuống, giữ nguyên kích thước, tự co khoảng cách thay vì thu nhỏ nút.
- Tam Liên Trảm & Vạn Tượng Lai Triều Thức không còn bay lên trời. Lướt (Q) không hồi chiêu.
- Kéo màn hình xoay camera 360° cả ngang lẫn dọc. Đã bỏ dòng chữ/nhãn "Phản Hồi".
- Nhất Trảm Độc Tôn mở Lãnh Địa thật (quái trong vực đứng im, chém tất trúng).
- R T Y U chỉ hiện với Thiên Mệnh Kiếm + Cửu Ngũ/Thiên Mệnh Kiếm Pháp; đổi sang kiếm/kiếm pháp khác thì tự tắt.
- Đang thi triển chiêu thì không dùng được chiêu khác. Thái Cực Âm Dương Cửu Cung Trảm đặt dưới chân.
- Nút "?" mở hướng dẫn chơi (đã cập nhật đầy đủ các mục trên trong tab Điều khiển và Mẹo).

Mọi chiêu của mọi kiếm đều là AOE (bán kính đánh tối thiểu 12).
