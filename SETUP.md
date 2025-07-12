# 🚀 คู่มือการติดตั้ง Wealth Condo Management System

## 📋 ขั้นตอนการติดตั้งแบบละเอียด

### 1. สร้างโปรเจกต์ Supabase

1. ไปที่ [https://supabase.com](https://supabase.com) และ Sign Up
2. คลิก "New Project"
3. กรอกข้อมูล:
   - **Project name**: wealth-condo
   - **Database Password**: (จดไว้ใช้ภายหลัง)
   - **Region**: Southeast Asia (Singapore)
4. คลิก "Create new project" และรอประมาณ 2 นาที

### 2. ตั้งค่า Database

1. เมื่อโปรเจกต์พร้อม ไปที่ **SQL Editor** ในเมนูซ้าย
2. คัดลอกและวาง SQL ด้านล่างนี้:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create rooms table
CREATE TABLE rooms (
    room_id TEXT PRIMARY KEY,
    building TEXT NOT NULL CHECK (building IN ('W1', 'W2', 'W3', 'Other')),
    status TEXT NOT NULL DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'reserved')),
    floor INTEGER,
    customer_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create customers table
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    room_id TEXT REFERENCES rooms(room_id),
    contract_start DATE NOT NULL,
    contract_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create invoices table
CREATE TABLE invoices (
    invoice_id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES rooms(room_id),
    customer_id UUID REFERENCES customers(id),
    billing_month TEXT NOT NULL,
    rent DECIMAL(10,2) NOT NULL,
    water_bill DECIMAL(10,2) NOT NULL DEFAULT 0,
    electric_bill DECIMAL(10,2) NOT NULL DEFAULT 0,
    parking_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid')),
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create repairs table
CREATE TABLE repairs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id TEXT REFERENCES rooms(room_id),
    customer_id UUID REFERENCES customers(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    technician_notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create user_roles table
CREATE TABLE user_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    role TEXT NOT NULL CHECK (role IN ('admin', 'customer', 'technician')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Add foreign key constraint
ALTER TABLE rooms ADD CONSTRAINT fk_customer 
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX idx_rooms_building ON rooms(building);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_invoices_room ON invoices(room_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_repairs_room ON repairs(room_id);
CREATE INDEX idx_repairs_status ON repairs(status);
```

3. คลิก "Run" และรอให้เสร็จ

### 3. เพิ่มข้อมูลห้องตัวอย่าง

คัดลอกและรัน SQL นี้:

```sql
-- Insert rooms for W1 (ตึก W1 - ห้องเลขล้วน)
INSERT INTO rooms (room_id, building, floor, status) VALUES
-- ชั้น 2
('201', 'W1', 2, 'vacant'),
('202', 'W1', 2, 'vacant'),
('203', 'W1', 2, 'vacant'),
('204', 'W1', 2, 'vacant'),
('205', 'W1', 2, 'vacant'),
('206', 'W1', 2, 'vacant'),
('207', 'W1', 2, 'vacant'),
('208', 'W1', 2, 'vacant'),
('209', 'W1', 2, 'vacant'),
('210', 'W1', 2, 'vacant'),
('212', 'W1', 2, 'vacant'),
('214', 'W1', 2, 'vacant'),
('215', 'W1', 2, 'vacant'),
('216', 'W1', 2, 'vacant'),
-- ชั้น 3
('301', 'W1', 3, 'vacant'),
('302', 'W1', 3, 'vacant'),
('303', 'W1', 3, 'vacant'),
('304', 'W1', 3, 'vacant'),
('305', 'W1', 3, 'vacant'),
('306', 'W1', 3, 'vacant'),
('307', 'W1', 3, 'vacant'),
('308', 'W1', 3, 'vacant'),
('309', 'W1', 3, 'vacant'),
('310', 'W1', 3, 'vacant'),
('312', 'W1', 3, 'vacant'),
('314', 'W1', 3, 'vacant'),
('315', 'W1', 3, 'vacant'),
('316', 'W1', 3, 'vacant'),
-- ชั้น 4
('401', 'W1', 4, 'vacant'),
('402', 'W1', 4, 'vacant'),
('403', 'W1', 4, 'vacant'),
('404', 'W1', 4, 'vacant'),
('405', 'W1', 4, 'vacant'),
('406', 'W1', 4, 'vacant'),
('407', 'W1', 4, 'vacant'),
('408', 'W1', 4, 'vacant'),
('409', 'W1', 4, 'vacant'),
('410', 'W1', 4, 'vacant'),
('412', 'W1', 4, 'vacant'),
('414', 'W1', 4, 'vacant'),
('415', 'W1', 4, 'vacant'),
('416', 'W1', 4, 'vacant'),
-- ชั้น 5
('501', 'W1', 5, 'vacant'),
('502', 'W1', 5, 'vacant'),
('503', 'W1', 5, 'vacant'),
('504', 'W1', 5, 'vacant'),
('505', 'W1', 5, 'vacant'),
('506', 'W1', 5, 'vacant'),
('507', 'W1', 5, 'vacant'),
('508', 'W1', 5, 'vacant'),
('509', 'W1', 5, 'vacant'),
('510', 'W1', 5, 'vacant'),
('512', 'W1', 5, 'vacant'),
('514', 'W1', 5, 'vacant'),
('515', 'W1', 5, 'vacant'),
('516', 'W1', 5, 'vacant'),
-- ชั้น 6
('601', 'W1', 6, 'vacant'),
('602', 'W1', 6, 'vacant'),
('603', 'W1', 6, 'vacant'),
('604', 'W1', 6, 'vacant'),
('605', 'W1', 6, 'vacant'),
('606', 'W1', 6, 'vacant'),
('607', 'W1', 6, 'vacant'),
('608', 'W1', 6, 'vacant'),
('609', 'W1', 6, 'vacant'),
('610', 'W1', 6, 'vacant'),
('612', 'W1', 6, 'vacant'),
('614', 'W1', 6, 'vacant'),
('615', 'W1', 6, 'vacant'),
('616', 'W1', 6, 'vacant'),
-- ชั้น 7
('701', 'W1', 7, 'vacant'),
('702', 'W1', 7, 'vacant'),
('703', 'W1', 7, 'vacant'),
('704', 'W1', 7, 'vacant'),
('705', 'W1', 7, 'vacant'),
('706', 'W1', 7, 'vacant'),
('707', 'W1', 7, 'vacant'),
('708', 'W1', 7, 'vacant'),
('709', 'W1', 7, 'vacant'),
('710', 'W1', 7, 'vacant'),
('712', 'W1', 7, 'vacant'),
('714', 'W1', 7, 'vacant'),
('715', 'W1', 7, 'vacant'),
('716', 'W1', 7, 'vacant'),
-- ชั้น 8
('801', 'W1', 8, 'vacant'),
('802', 'W1', 8, 'vacant'),
('803', 'W1', 8, 'vacant'),
('804', 'W1', 8, 'vacant'),
('805', 'W1', 8, 'vacant'),
('806', 'W1', 8, 'vacant'),
('807', 'W1', 8, 'vacant'),
('808', 'W1', 8, 'vacant'),
('809', 'W1', 8, 'vacant'),
('810', 'W1', 8, 'vacant'),
('812', 'W1', 8, 'vacant'),
('814', 'W1', 8, 'vacant'),
('815', 'W1', 8, 'vacant'),
('816', 'W1', 8, 'vacant'),
-- ชั้น 9
('901', 'W1', 9, 'vacant'),
('902', 'W1', 9, 'vacant'),
('903', 'W1', 9, 'vacant'),
('904', 'W1', 9, 'vacant'),
('905', 'W1', 9, 'vacant'),
('906', 'W1', 9, 'vacant'),
('907', 'W1', 9, 'vacant'),
('908', 'W1', 9, 'vacant'),
('909', 'W1', 9, 'vacant'),
('910', 'W1', 9, 'vacant'),
('912', 'W1', 9, 'vacant'),
('914', 'W1', 9, 'vacant'),
('915', 'W1', 9, 'vacant'),
('916', 'W1', 9, 'vacant');

-- Insert rooms for W2 (ตึก W2 - ห้องลงท้ายด้วย A หรือ B)
INSERT INTO rooms (room_id, building, floor, status) VALUES
-- ห้อง A
-- ชั้น 2
('201A', 'W2', 2, 'vacant'),
('202A', 'W2', 2, 'vacant'),
('203A', 'W2', 2, 'vacant'),
('204A', 'W2', 2, 'vacant'),
('205A', 'W2', 2, 'vacant'),
('206A', 'W2', 2, 'vacant'),
('207A', 'W2', 2, 'vacant'),
-- ชั้น 3
('301A', 'W2', 3, 'vacant'),
('302A', 'W2', 3, 'vacant'),
('303A', 'W2', 3, 'vacant'),
('304A', 'W2', 3, 'vacant'),
('305A', 'W2', 3, 'vacant'),
('306A', 'W2', 3, 'vacant'),
('307A', 'W2', 3, 'vacant'),
-- ชั้น 4
('401A', 'W2', 4, 'vacant'),
('402A', 'W2', 4, 'vacant'),
('403A', 'W2', 4, 'vacant'),
('404A', 'W2', 4, 'vacant'),
('405A', 'W2', 4, 'vacant'),
('406A', 'W2', 4, 'vacant'),
('407A', 'W2', 4, 'vacant'),
-- ชั้น 5
('501A', 'W2', 5, 'vacant'),
('502A', 'W2', 5, 'vacant'),
('503A', 'W2', 5, 'vacant'),
('504A', 'W2', 5, 'vacant'),
('505A', 'W2', 5, 'vacant'),
('506A', 'W2', 5, 'vacant'),
('507A', 'W2', 5, 'vacant'),
-- ชั้น 6
('601A', 'W2', 6, 'vacant'),
('602A', 'W2', 6, 'vacant'),
('603A', 'W2', 6, 'vacant'),
('604A', 'W2', 6, 'vacant'),
('605A', 'W2', 6, 'vacant'),
('606A', 'W2', 6, 'vacant'),
('607A', 'W2', 6, 'vacant'),
-- ห้อง B
-- ชั้น 2
('201B', 'W2', 2, 'vacant'),
('202B', 'W2', 2, 'vacant'),
('203B', 'W2', 2, 'vacant'),
('204B', 'W2', 2, 'vacant'),
('205B', 'W2', 2, 'vacant'),
('206B', 'W2', 2, 'vacant'),
('207B', 'W2', 2, 'vacant'),
-- ชั้น 3
('301B', 'W2', 3, 'vacant'),
('302B', 'W2', 3, 'vacant'),
('303B', 'W2', 3, 'vacant'),
('304B', 'W2', 3, 'vacant'),
('305B', 'W2', 3, 'vacant'),
('306B', 'W2', 3, 'vacant'),
('307B', 'W2', 3, 'vacant'),
-- ชั้น 4
('401B', 'W2', 4, 'vacant'),
('402B', 'W2', 4, 'vacant'),
('403B', 'W2', 4, 'vacant'),
('404B', 'W2', 4, 'vacant'),
('405B', 'W2', 4, 'vacant'),
('406B', 'W2', 4, 'vacant'),
('407B', 'W2', 4, 'vacant'),
-- ชั้น 5
('501B', 'W2', 5, 'vacant'),
('502B', 'W2', 5, 'vacant'),
('503B', 'W2', 5, 'vacant'),
('504B', 'W2', 5, 'vacant'),
('505B', 'W2', 5, 'vacant'),
('506B', 'W2', 5, 'vacant'),
('507B', 'W2', 5, 'vacant'),
-- ชั้น 6
('601B', 'W2', 6, 'vacant'),
('602B', 'W2', 6, 'vacant'),
('603B', 'W2', 6, 'vacant'),
('604B', 'W2', 6, 'vacant'),
('605B', 'W2', 6, 'vacant'),
('606B', 'W2', 6, 'vacant'),
('607B', 'W2', 6, 'vacant');

-- Insert rooms for W3 (ตึก W3 - ห้องขึ้นต้นด้วย W3_)
INSERT INTO rooms (room_id, building, floor, status) VALUES
-- ชั้น 1
('W3_101', 'W3', 1, 'vacant'),
('W3_102', 'W3', 1, 'vacant'),
('W3_103', 'W3', 1, 'vacant'),
('W3_104', 'W3', 1, 'vacant'),
('W3_105', 'W3', 1, 'vacant'),
('W3_106', 'W3', 1, 'vacant'),
('W3_107', 'W3', 1, 'vacant'),
('W3_108', 'W3', 1, 'vacant'),
('W3_109', 'W3', 1, 'vacant'),
-- ชั้น 2
('W3_201', 'W3', 2, 'vacant'),
('W3_202', 'W3', 2, 'vacant'),
('W3_203', 'W3', 2, 'vacant'),
('W3_204', 'W3', 2, 'vacant'),
('W3_205', 'W3', 2, 'vacant'),
('W3_206', 'W3', 2, 'vacant'),
('W3_207', 'W3', 2, 'vacant'),
('W3_208', 'W3', 2, 'vacant'),
('W3_209', 'W3', 2, 'vacant'),
('W3_210', 'W3', 2, 'vacant'),
('W3_211', 'W3', 2, 'vacant'),
-- ชั้น 3
('W3_301', 'W3', 3, 'vacant'),
('W3_302', 'W3', 3, 'vacant'),
('W3_303', 'W3', 3, 'vacant'),
('W3_304', 'W3', 3, 'vacant'),
('W3_305', 'W3', 3, 'vacant'),
('W3_306', 'W3', 3, 'vacant'),
('W3_307', 'W3', 3, 'vacant'),
('W3_308', 'W3', 3, 'vacant'),
('W3_309', 'W3', 3, 'vacant'),
('W3_310', 'W3', 3, 'vacant'),
('W3_311', 'W3', 3, 'vacant'),
-- ชั้น 4
('W3_401', 'W3', 4, 'vacant'),
('W3_402', 'W3', 4, 'vacant'),
('W3_403', 'W3', 4, 'vacant'),
('W3_404', 'W3', 4, 'vacant'),
('W3_405', 'W3', 4, 'vacant'),
('W3_406', 'W3', 4, 'vacant'),
('W3_407', 'W3', 4, 'vacant'),
('W3_408', 'W3', 4, 'vacant'),
('W3_409', 'W3', 4, 'vacant'),
('W3_410', 'W3', 4, 'vacant'),
('W3_411', 'W3', 4, 'vacant'),
-- ชั้น 5
('W3_501', 'W3', 5, 'vacant'),
('W3_502', 'W3', 5, 'vacant'),
('W3_503', 'W3', 5, 'vacant'),
('W3_504', 'W3', 5, 'vacant'),
('W3_505', 'W3', 5, 'vacant'),
('W3_506', 'W3', 5, 'vacant'),
('W3_507', 'W3', 5, 'vacant'),
('W3_508', 'W3', 5, 'vacant'),
('W3_509', 'W3', 5, 'vacant'),
('W3_510', 'W3', 5, 'vacant'),
('W3_511', 'W3', 5, 'vacant');

-- Insert special areas (พื้นที่พิเศษ)
INSERT INTO rooms (room_id, building, status) VALUES
('มินิมาร์ท1', 'Other', 'occupied'),
('มินิมาร์ท2', 'Other', 'occupied'),
('ตู้น้องแพ็ค', 'Other', 'occupied'),
('ร้านซักผ้า', 'Other', 'occupied'),
('ร้านกาแฟ', 'Other', 'occupied'),
('ไหม', 'Other', 'occupied'),
('ซอ', 'Other', 'occupied'),
('ป้าวรรณ', 'Other', 'occupied'),
('ร้านอาหาร', 'Other', 'occupied'),
('ป้าแม่บ้าน', 'Other', 'occupied');
```

### 4. ตั้งค่า Storage

1. ไปที่ **Storage** ในเมนูซ้าย
2. คลิก "New bucket" และสร้าง 2 buckets:
   - **Name**: `documents` (สำหรับเก็บ PDF)
   - **Public**: ✅ ติ๊ก
   - คลิก "Create bucket"
   
   - **Name**: `repair-images` (สำหรับรูปการซ่อม)
   - **Public**: ✅ ติ๊ก
   - คลิก "Create bucket"

### 5. สร้างผู้ใช้ทดสอบ

1. ไปที่ **Authentication** > **Users**
2. คลิก "Invite user" และสร้าง 3 users:

**Admin:**
- Email: `admin@wealthcondo.com`
- Password: `admin123`

**Customer:**
- Email: `customer@wealthcondo.com`
- Password: `customer123`

**Technician:**
- Email: `technician@wealthcondo.com`
- Password: `tech123`

### 6. กำหนด Role ให้ผู้ใช้

1. หลังสร้าง user แล้ว คัดลอก User ID ของแต่ละคน
2. ไปที่ SQL Editor และรัน:

```sql
-- แทน USER_ID ด้วย ID จริงที่คัดลอกมา
INSERT INTO user_roles (user_id, role) VALUES
('USER_ID_ของ_ADMIN', 'admin'),
('USER_ID_ของ_CUSTOMER', 'customer'),
('USER_ID_ของ_TECHNICIAN', 'technician');

-- เพิ่มข้อมูลลูกค้าตัวอย่าง
INSERT INTO customers (name, email, phone, room_id, contract_start, contract_end) VALUES
('นายทดสอบ ระบบ', 'customer@wealthcondo.com', '0812345678', '103', '2025-01-01', '2025-12-31');

-- อัปเดตห้องให้มีผู้เช่า
UPDATE rooms SET status = 'occupied', customer_id = (SELECT id FROM customers WHERE email = 'customer@wealthcondo.com') WHERE room_id = '103';
```

### 7. ตั้งค่าโปรเจกต์

1. ไปที่ **Settings** > **API**
2. คัดลอก:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. เปิดไฟล์ `js/supabaseClient.js` และแทนที่:

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co'; // ใส่ URL ของคุณ
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // ใส่ Key ของคุณ
```

### 8. ทดสอบระบบ

1. เปิด Terminal/Command Prompt
2. cd ไปที่โฟลเดอร์โปรเจกต์
3. รัน:

```bash
npm install
npm start
```

4. เปิดเบราว์เซอร์ไปที่ `http://localhost:8080/login.html`
5. ทดสอบ login ด้วย user ที่สร้างไว้

### 9. Deploy ขึ้น GitHub Pages

1. สร้าง GitHub Repository ใหม่
2. Push โค้ดขึ้น GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wealth-condo.git
git push -u origin main
```

3. ไปที่ Repository Settings > Pages
4. Source: Deploy from a branch
5. Branch: main / folder: /public
6. Save และรอ 2-3 นาที
7. เข้าใช้งานที่: `https://YOUR_USERNAME.github.io/wealth-condo/login.html`

## 🔧 การแก้ปัญหาที่พบบ่อย

### ปัญหา: Login ไม่ได้
- ตรวจสอบว่าใส่ SUPABASE_URL และ ANON_KEY ถูกต้อง
- ตรวจสอบว่า user มี role ในตาราง user_roles

### ปัญหา: ไม่เห็นห้อง
- ตรวจสอบว่ารัน SQL insert rooms แล้ว
- ดูใน Table Editor ว่ามีข้อมูลหรือไม่

### ปัญหา: Upload รูป/PDF ไม่ได้
- ตรวจสอบว่าสร้าง Storage buckets แล้ว
- ตรวจสอบว่า buckets เป็น public

## 📞 ต้องการความช่วยเหลือ?

- ดู Console log ในเบราว์เซอร์ (F12)
- ตรวจสอบ Network tab ว่า API call สำเร็จหรือไม่
- ดู Supabase Dashboard > Logs

---

🎉 **ยินดีด้วย! ระบบ Wealth Condo พร้อมใช้งานแล้ว**