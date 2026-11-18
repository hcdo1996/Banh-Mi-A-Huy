# AGENTS.md — hướng dẫn cho AI/dev tiếp tục dự án

Game web tĩnh (không build). Mở `index.html` là chạy. Deploy: GitHub Pages từ nhánh `main`, thư mục gốc.

## Cấu trúc
- `index.html` — sân khấu 1600×900 (tự scale), CSS, khung các phần tử.
- `data.js` — dữ liệu: `CHARS` (nhân vật + mặt), `RECIPES`, `DRINKS`, `UPGRADES`, `DAYS` (1–7 cốt truyện, 8 = chế độ "Bán tới sáng"), `STORY` (thoại visual novel), `eveningScript`, hội thi.
- `game.js` — engine: vòng ngày (`startDay → runDay → tick`), các bước làm bánh (`step`), đồ uống, gag theo khách (`greet`, `promote`, `serve`), VN dialogue (`vnPlay`), menu, shop, endless (`startEndless`).
- `vo_list.js` — danh sách file giọng có sẵn (tạo bằng `tools/volist.sh`). Câu nào không có file thì im lặng, không lỗi.
- `preload.js` — ảnh tải trước cho màn hình chờ.
- `assets/` — `c_<nhânvật>_<mặt>.webp` (cao 640px), `g_<id>.webp` (ảnh gallery), `p_*` (chân dung VN), `vo/*.mp3` (giọng), `sfx/` (chó, mèo).

## Quy ước
- Mọi chữ hiển thị dùng `L('tiếng Việt','English')`.
- Thoại VN: `{who:'na',f:'blouse_happy',t:L(...),vo:'na_5'}` — `vo` là tên file trong `assets/vo/`.
- Khách mới: thêm vào `CHARS` (data.js), câu chào trong `greet()` (game.js), đặt vào `DAYS[n].cust`, thêm vào `GAL` (gallery) và `ENDLESS_POOL`.
- Giọng khách: 5 câu theo thứ tự arrive, hurry, wrong, happy, leave → `<voice>_0..4.mp3`.
- Không dùng tên/mặt/câu cửa miệng của người nổi tiếng thật — chỉ làm nhân vật "kiểu" đó.

## Công cụ (tools/)
- `mkchar.py sheet.png Folder id front,happy,angry,shocked,eating` — cắt 5 dáng từ ảnh nền trắng → webp.
- `voice_split.py <key> <mp3-url> [indexes]` — tách file giọng (các câu cách nhau bằng khoảng lặng) theo `tools/voices.json`.
- `volist.sh` — cập nhật `vo_list.js`.
- `bot.py <day> 1600 900` — bot Playwright tự chơi 1 ngày, in kết quả + lỗi JS (cần `python3 -m http.server 8765`).

## Việc còn dở
- Thay nhạc nền (đang là WebAudio tự tạo trong `startMusic`) bằng file nhạc thật.
- Thu lại vài câu khách hơi ngọng: be_ti_4, anh_son_3, ong_thanh_3/4, van_4, co_hanh_2.
- Phần lớn thoại VN của Na/A Huy/Má chưa có giọng (chỉ các câu chính).
