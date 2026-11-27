# Tổng Hợp Kiếm Pháp 3D

Game chiến đấu kiếm pháp 3D chạy trên trình duyệt (three.js), tối ưu cho điện thoại xoay ngang và máy tính. Đã gói sẵn three.js trong `lib/` nên chạy được không cần Internet (trừ AI boss và chế độ `?debug`).

## Chạy game

**GitHub Pages:** https://toilalode.github.io/tutaohtml (thêm `?debug` vào cuối địa chỉ để bật Eruda, cần mạng).

**Localhost:**
```
pkg install nodejs
git clone https://github.com/toilalode/tutaohtml.git
cd tutaohtml
npm install
npm start PORT=8000
```
Lệnh phải chạy ngay trong thư mục gốc của repo (nơi có `index.html` và `lib/three.min.js`).

**Cài như app:** mở bằng Chrome, menu ⋮ → "Thêm vào màn hình chính". Nhớ bật "Xoay tự động" của điện thoại.

**Nếu màn hình đen:**
- Mở `index.html` trong thư mục có `lib/three.min.js`, đừng tách file ra.
- Bật WebGL / tăng tốc phần cứng, thử Chrome mới nhất.
- Ctrl+Shift+R để xóa cache, xem Console (F12) để biết file nào lỗi 404.
- Trang sẽ hiện dòng chữ đỏ nếu thiếu `three.min.js`; lỗi script cũng hiện trong khung đỏ ở đầu màn hình.

## Điều khiển

| Thao tác | Máy tính | Điện thoại |
|---|---|---|
| Di chuyển | WASD | Joystick trái |
| Nhảy | Space | Nút ⤒ |
| Lướt (không hồi chiêu, tốn 8 thể lực) | Q | Nút Q |
| Đỡ đòn (giữ) | E | Nút E |
| M1 đánh thường | Chuột trái / Tab | Chạm màn hình (giữ yên = đánh liên tục) |
| M2 | Chuột phải / H | Nút M2 |
| Chọn kiếm pháp / kiếm / skin | 1 / 2 / 3 | Nút 1 / 2 / 3 |
| Chiêu | Z X C V B N M J F G H | Hàng nút dưới |
| Buff | R T Y U | Hàng nút dưới |
| Xoay camera | Kéo chuột, mũi tên | Kéo ngón nửa phải màn hình (360° cả ngang lẫn dọc) |
| Thu phóng | Con lăn, O / P | Chụm 2 ngón, nút ＋ － |
| Tâm (shift-lock) | Shift | Nút 🔒/🔓 |

- Đang thi triển chiêu thì không lướt, nhảy hay dùng chiêu khác được, quái cũng không đánh trúng bạn.
- Tự hồi máu 2 HP/giây sau 3 giây không bị đánh. Game tự lưu mỗi 2 giây.
- Nút `?` mở hướng dẫn chi tiết trong game.

## Kiếm và kiếm pháp

**Kiếm:** Titan Sword (×1), Taichi Sword (×1,25; ×3 thêm khi dùng Thái Cực), Thiên Mệnh Kiếm (×1,7; thêm ×1,5 sát thương, vùng đánh ×1,5, hồi chiêu và thể lực ×0,4 khi dùng Cửu Ngũ hoặc Thiên Mệnh), Kiếm Phượng Tước.

**Kiếm pháp:** Cửu Ngũ Chí Tôn, Thiên Mệnh, Tứ Tượng, Thái Cực, Định Hải, Chung Yên, Phượng Tước, Nhất Vương Tài Quyết Lục.


## Phó bản Phượng Tước Kiếm

Vào bằng nút Map → Phó bản Phượng Tước Kiếm, nói chuyện với NPC bằng phím `I`.

- **Map 1:** làm nhiệm vụ nhận Kiếm Phượng Tước.
- **Map 2:** đánh Nguyên Phượng, đổi ngọc lấy skin Vàng Trắng (nút 3 để đổi skin).
- **Map 3:** khiêu chiến Định Vương → Thí Vương → Tĩnh Vương → Viêm Đế → Hỗn Độn → Xi Vưu, mỗi boss mở chiêu, ngọc và Thiên Tướng.

**Kiếm Hồn Nhất Vương (R)** và **Thiên Tướng (T)** không dùng chung được: bật cái này thì cấm cái kia.

**Nhất Vương Trấn Áp (M2)** cần bật Kiếm Hồn trước; một đòn diệt tất cả, bóng, tia và quái đều đen, thỉnh thoảng có tia, mắt và vòng đỏ. Nút chỉ ghi "Trấn Áp".

**Hitbox:** skin Đỏ ×250, skin Vàng Trắng ×1.000, bật Kiếm Hồn Nhất Vương nhân thêm ×750.

**Màu chiêu theo skin** (`ptpalette.js`): skin Đỏ chủ yếu đỏ, thỉnh thoảng vàng; skin Vàng Trắng chủ yếu vàng, thỉnh thoảng trắng; hai chiêu Nhất Vương Tài Quyết Lục chủ yếu đen, thỉnh thoảng đỏ.

## Map Test

Game khởi động vào map Test. Có 1 quái bù nhìn với ô sửa máu hiện tại/tối đa (nút Đặt, Đầy), thanh máu trên đầu quái, sát thương vừa gây hiện giữa màn hình trong 3,5 giây. Nút **Tấn công** cạnh nút Đầy bật cho quái đứng yên tại chỗ và đánh bạn.

Mọi chiêu đều là AOE (bán kính đánh tối thiểu 12).

## Cấu trúc file

Thứ tự thẻ `<script>` trong `index.html` quyết định file nào ghi đè hàm của file nào, đừng đổi thứ tự.

| File | Vai trò |
|---|---|
| `index.html`, `style.css`, `dungeon.css`, `fix.css`, `custom.css` | Khung giao diện (HUD, nút, popup) |
| `gl.js` | Thiết lập WebGL dự phòng, `?debug` tải Eruda |
| `skills.js`, `beasts.js` | Bảng chiêu và mô hình bốn thú Tứ Tượng |
| `chungyen.js`, `ptpre.js` | Bảng chiêu Chung Yên, phần chuẩn bị Phượng Tước |
| `rule.js` | Menu Quy Luật Kiếm Hồn (nạp trước `game.js`) |
| `game.js` | Lõi game: nhân vật, quái, chiêu, điều khiển, hướng dẫn |
| `hp.js`, `zoom.js`, `cutscene.js` | Hiển thị HP, thu phóng và Tâm, cắt cảnh |
| `dungeon.js`, `bossai.js` | Phó bản Chung Yên Hoàng Đế; AI boss (gọi API ngoài, không có mạng thì chọn chiêu ngẫu nhiên) |
| `taicuc.js`, `luongcuc.js` | Chiêu Thái Cực và Lưỡng Cực Vô Lượng |
| `chungyen-rtyu.js` | Buff R T Y U của Chung Yên |
| `phuongtuoc.js` | Phó bản Phượng Tước: map, boss, nhiệm vụ, skin, Thiên Tướng, Vạn Quái |
| `ptfix.js` | Nhất Vương Tài Quyết Lục, Nhất Vương Trấn Áp, phần đỏ của Kiếm Hồn, khóa chung R/Thiên Tướng |
| `ptskill.js` | Đệ Nhị, Tam, Ngũ, Chung Chương |
| `ptpalette.js` | Đổi màu chiêu theo skin |
| `nomain.js`, `fix.js` | Bỏ map chính (vào thẳng Test), vá hiển thị; nạp sau cùng |
| `resetsave.js` | Hỗ trợ xóa lưu |
| `sw.js`, `manifest.json` | Service worker và manifest để cài như app |
| `server.js`, `package.json` | Server localhost |
| `agents.md` | Quy tắc lập trình cho repo |

Khi thêm file `.js`/`.css` mới phải thêm vào danh sách `CORE` trong `sw.js` và tăng `V`.

## Lưu game

Dùng localStorage, tự lưu mỗi 2 giây (kiếm, kiếm pháp, quy luật, kỷ lục; Phượng Tước lưu riêng ở `tm_pt_v1`). Xóa lưu: mở Console gõ `resetSave()`. `localhost:8000` và `IP-máy:8000` là hai bộ lưu riêng.
