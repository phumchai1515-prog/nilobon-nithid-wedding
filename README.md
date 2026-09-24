# Wedding E-Card · Nilobon & Nithid · 07.11.2026

การ์ดเชิญดิจิทัลแบบหน้าเดียวสำหรับมือถือ เป็น HTML/CSS/JS ล้วน ไม่มีขั้นตอน build โฮสต์บน GitHub Pages

**ลิงก์การ์ด:** https://phumchai1515-prog.github.io/nilobon-nithid-wedding/
**สร้างลิงก์ใส่ชื่อแขก:** https://phumchai1515-prog.github.io/nilobon-nithid-wedding/invite-links.html

## โครงสร้างไฟล์

```
ecard-site/
├── index.html            หน้าการ์ด (เนื้อหาทั้งหมดอยู่ที่นี่)
├── invite-links.html     เครื่องมือสร้างลิงก์ ?to=ชื่อแขก
├── wedding.ics           ไฟล์ "บันทึกลงปฏิทิน"
│
├── css/                  สไตล์ แยกตามส่วนของหน้า (โหลดตามลำดับนี้)
│   ├── base.css          สี ฟอนต์ ปุ่ม หัวข้อ ลายเส้นทอง และส่วนที่ใช้ร่วมกัน
│   ├── intro.css         ฉากเปิด
│   ├── hero.css          รูปปก · วันที่ · บัตรขูด · นับถอยหลัง
│   ├── sections.css      คำเชิญ · ลำดับพิธี · บ่าวสาว · Dress code · รูปคั่น · แผนที่ · อวยพร · ท้ายการ์ด
│   ├── gallery.css       อัลบั้ม 30 รูป · lightbox
│   └── effects.css       แถบเมนูล่าง · toast · แถบความคืบหน้า · กลีบดอก · หัวใจ · ประกายทอง
│
├── js/                   หนึ่งไฟล์ต่อหนึ่งฟีเจอร์
│   ├── guest.js          ใส่ชื่อแขกจาก ?to=
│   ├── countdown.js      นับถอยหลังแบบพลิก (วันเวลางานตั้งค่าที่หัวไฟล์)
│   ├── scroll.js         เอฟเฟกต์ค่อยๆ ปรากฏ · parallax · แถบความคืบหน้า
│   ├── intro.js          ฉากเปิด · กลีบดอก
│   ├── gallery.js        อัลบั้ม · lightbox
│   ├── scratch.js        บัตรขูด
│   ├── effects.js        หัวใจเวลาแตะ · ประกายทอง
│   └── dock.js           แถบเมนูล่าง · ปุ่มแชร์
│
├── assets/
│   ├── brand/            โลโก้ (monogram สีทอง/สีไวน์ · ลายเซ็นชื่อ · favicon)
│   ├── images/           รูปปก · ภาพพรีวิวลิงก์ (og.jpg) · QR แผนที่ · QR อวยพร
│   └── photos/           รูปพรีเวดดิ้ง 30 รูป: NNN.jpg (2000px) และ NNN-s.jpg (720px)
│
├── design/               ไฟล์ต้นฉบับ ไม่ได้ใช้ในหน้าเว็บ
│   ├── og-template.html  แม่แบบภาพพรีวิวลิงก์ 1200×630
│   └── monogram-original.jpeg
│
└── tools/
    └── bump-version.sh   ใส่เลขเวอร์ชันให้ CSS/JS กันมือถือจำไฟล์เก่า
```

## แก้ไขบ่อย

| อยากแก้ | ไปที่ |
|---|---|
| ชื่อ ผู้ใหญ่ ลำดับพิธี ข้อความ | `index.html` |
| วันเวลางาน (สำหรับนับถอยหลัง) | `WEDDING_START` / `WEDDING_END` ใน `js/countdown.js` |
| สีธีม | ตัวแปร `:root` ใน `css/base.css` |
| รูปในฉากเปิด | `<div class="intro__slides">` ใน `index.html` |
| รูปในอัลบั้ม / ลำดับ / รูปที่ซ่อนไว้ | `<div class="album">` ใน `index.html` (`is-extra` = ซ่อนจนกด "ดูภาพทั้งหมด") |
| ข้อความตอนแชร์ | `SHARE_TEXT` ใน `js/dock.js` |

## ขึ้นเว็บ (deploy)

```sh
./tools/bump-version.sh     # ต้องรันทุกครั้ง ไม่งั้นมือถือจะใช้ CSS/JS เก่า
git add -A && git commit -m "..." && git push
```

GitHub Pages อัปเดตภายในราว 1 นาที ส่วนตัวไฟล์ HTML อาจค้างในมือถือได้ถึง 10 นาที
