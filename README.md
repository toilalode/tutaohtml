# Tổng Hợp Kiếm Pháp 3D — hướng dẫn chạy (không màn hình đen)
Game đã gói sẵn three.js trong `lib/` nên KHÔNG cần Internet.

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

### Thu phóng & xoay camera (xem chiêu bao quanh)
- **Máy tính:** cuộn **chuột giữa** lên = phóng gần, xuống = thu xa (từ 3 đến 220). Mũi tên **← → ↑ ↓** xoay camera.
- **Điện thoại:** **chụm 2 ngón** trên khung cảnh (không đặt trên nút/joystick) để thu phóng; kéo 1 ngón nửa phải màn hình để xoay.
- **Hàng nút trên nút Q (cột phải):** `[🔒/🔓] [＋] [－]`. ＋ phóng gần, － thu xa (giữ để zoom liên tục); － nằm ngay trên Q, cách 6px.
- **Nút tròn khoá (bật/tắt tâm):** 🔓 = tắt tâm; 🔒 = bật tâm — hiện tâm ngắm đỏ bám theo mục tiêu mà chiêu sẽ đánh vào (quái gần nhất, không có quái thì điểm phía trước nhân vật).
- Zoom xa vẫn thấy nhân vật và chiêu: sương mù, bầu trời, mặt đất tự mở rộng; vòm Lãnh Địa tự trong hơn khi camera ra ngoài.
- Cột nút trái lùi xuống 15px, cột phải lùi xuống 8px; nếu màn hình thấp, cả cột tự thu nhỏ để không chèn HUD và hàng chiêu.
- Mã nằm trong `zoom.js` (nạp sau `game.js`).

## Màn hình ngang
Chạm màn hình "Chạm để vào game" → game vào toàn màn hình và khoá xoay ngang (Chrome Android). Nếu máy vẫn để dọc, giao diện tự xoay 90°. Muốn mở như app: menu Chrome ⋮ → "Thêm vào màn hình chính" (manifest.json đặt sẵn chế độ ngang toàn màn hình). Nhớ bật "Xoay tự động" của điện thoại để khoá ngang hoạt động tốt nhất.

## Cập nhật mới
- Thu phóng camera: con lăn chuột, chụm 2 ngón, nút ＋ －; nút tròn khoá bật/tắt tâm ngắm; sửa vị trí hai cột nút.
- Tam Liên Trảm & Vạn Tượng Lai Triều Thức không còn bay lên trời. Lướt (Q) không hồi chiêu.
- Kéo màn hình xoay camera 360° cả ngang lẫn dọc. Đã bỏ dòng chữ/nhãn "Phản Hồi".
- Nhất Trảm Độc Tôn mở Lãnh Địa thật (quái trong vực đứng im, chém tất trúng).
- R T Y U chỉ hiện với Thiên Mệnh Kiếm + Cửu Ngũ/Thiên Mệnh Kiếm Pháp; đổi sang kiếm/kiếm pháp khác thì tự tắt.
- Đang thi triển chiêu thì không dùng được chiêu khác. Thái Cực Âm Dương Cửu Cung Trảm đặt dưới chân.
- Cột phải hạ 20px (tự nâng lên nếu chèn hàng chiêu). Nút "?" mở hướng dẫn chơi.


Mọi chiêu của mọi kiếm đều là AOE (bán kính đánh tối thiểu 12).

Nút 🗺 Map (dưới Hướng dẫn): chọn Map chính hoặc map Test (1 quái bù nhìn bị choáng, không đánh, không hồi máu, có thanh máu trên đầu và ô sửa máu hiện tại/tối đa). Sát thương vừa gây hiện giữa màn hình trong 3,5 giây và cộng dồn.
