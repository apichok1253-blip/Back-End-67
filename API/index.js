const express = require("express");
const app = express();
app.use(express.json());

app.get("/hello", (req, res) => {
  res.json({ message: "สวัสดี Back-End!" });
});

// ข้อมูลโครงงานของทีม (แก้เป็นของทีมตัวเอง)
const members = [
  { id: 1, name: "นาย อภิโชค ทองมี", role: "Developer A" },
  { id: 2, name: "นาย อัม์กร รักธรรม", role: "Developer B" },
];

const project = {
  team: "ยสตน",
  topic: "ระบบประกาศข่าวแผนก",
  problem: "แก้ปัญหาคนในแผนงไม่ได้รับรู้ข่าวสารทั่วถึง",
  users: ["นักศึกษา", "อาจารย์"],
  members,
};

app.get("/project", (req, res) => {
  res.json(project);
});

// ข้อมูลตั้งต้นของ resource หลัก (เก็บในหน่วยความจำ)
let announcements = [
  { id: 1, title: 'ประกาศกำหนดส่งงาน', department: 'เทคโนโลยีสารสนเทศ', status: 'pending' },
  { id: 2, title: 'แจ้งกำหนดการสอบปลายภาค', department: 'เทคโนโลยีสารสนเทศ', status: 'done' },
];
let nextId = 3;
 
// R: ดูทั้งหมด (รองรับ ?status=pending)
app.get('/announcements', (req, res) => {
  const { status } = req.query;
  if (status) {
    return res.json(announcements.filter((a) => a.status === status));
  }
  res.json(announcements);
});
 
// R: ดู 1 รายการ
app.get('/announcements/:id', (req, res) => {
  const id = Number(req.params.id);
  const announcement = announcements.find((a) => a.id === id);
  if (!announcement) {
    return res.status(404).json({ message: 'ไม่พบรายการประกาศ' });
  }
  res.json(announcement);
});
 
// C: เพิ่ม
app.post('/announcements', (req, res) => {
  const { title, department } = req.body;
  if (!title || !department) {
    return res.status(400).json({ message: 'ต้องส่ง title และ department' });
  }
  const announcement = { id: nextId++, title, department, status: 'pending' };
  announcements.push(announcement);
  res.status(201).json(announcement);
});
 
// U: แก้ไข
app.put('/announcements/:id', (req, res) => {
  const id = Number(req.params.id);
  const announcement = announcements.find((a) => a.id === id);
  if (!announcement) {
    return res.status(404).json({ message: 'ไม่พบรายการประกาศ' });
  }
  const allowed = ['pending', 'doing', 'done'];
  if (req.body.status && !allowed.includes(req.body.status)) {
    return res.status(400).json({ message: 'status ต้องเป็น pending, doing หรือ done' });
  }
  announcement.title = req.body.title ?? announcement.title;
  announcement.department = req.body.department ?? announcement.department;
  announcement.status = req.body.status ?? announcement.status;
  res.json(announcement);
});
 
// D: ลบ
app.delete('/announcements/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = announcements.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบรายการประกาศ' });
  }
  announcements.splice(index, 1);
  res.status(204).send();
});
 
// ไม่ตรงกับ route ใดเลย
app.use((req, res) => {
  res.status(404).json({ message: `ไม่มี ${req.method} ${req.path} ในระบบ` });
});
 
app.listen(3000, (err) => {
  if (err) {
    return console.log("เปิดเซิร์ฟเวอร์ไม่ได้:", err.message);
  }
  console.log("Server running on http://localhost:3000");
});