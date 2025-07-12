# Wealth Condo - ระบบจัดการหอพัก

ระบบจัดการหอพัก Wealth Condo พัฒนาด้วย HTML, Tailwind CSS, JavaScript และ Supabase

## 🚀 Features

### 👨‍💼 สำหรับผู้ดูแลระบบ (Admin)
- ดูผังห้องแยกตามตึก (W1, W2, W3, พื้นที่อื่นๆ)
- จัดการข้อมูลผู้เช่า (เพิ่ม/ลบ)
- สร้างใบแจ้งหนี้พร้อมคำนวณค่าน้ำ-ไฟอัตโนมัติ
- ดูประวัติใบแจ้งหนี้และอัปเดตสถานะการชำระ

### 👤 สำหรับผู้เช่า (Customer)
- เข้าสู่ระบบดูข้อมูลส่วนตัวและห้องพัก
- ดูประวัติใบแจ้งหนี้และดาวน์โหลด PDF
- แจ้งซ่อมและติดตามสถานะ

### 🔧 สำหรับช่างซ่อม (Technician)
- ดูรายการแจ้งซ่อมแยกตามสถานะ
- อัปเดตสถานะการซ่อม
- เพิ่มหมายเหตุและรูปภาพหลังซ่อม

## 📋 โครงสร้างหอพัก

- **ตึก W1**: ห้องเป็นตัวเลขล้วน (201, 305, 916)
- **ตึก W2**: ห้องลงท้ายด้วย A/B (302A, 504B)
- **ตึก W3**: ห้องขึ้นต้นด้วย W3_ (W3_101, W3_504)
- **พื้นที่อื่นๆ**: ร้านค้า, ร้านซักผ้า, มินิมาร์ท ฯลฯ

## 🛠️ การติดตั้ง

### 1. Setup Supabase

1. สร้างโปรเจกต์ใหม่ที่ [Supabase](https://supabase.com)
2. คัดลอก `Project URL` และ `anon key` จาก Settings > API
3. อัปเดตไฟล์ `js/supabaseClient.js`:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 2. สร้าง Database Tables

รันคำสั่ง SQL ต่อไปนี้ใน Supabase SQL Editor:

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

### 3. เพิ่มข้อมูลตัวอย่าง

```sql
-- Insert sample rooms for W1
INSERT INTO rooms (room_id, building, floor, status) VALUES
('101', 'W1', 1, 'vacant'),
('102', 'W1', 1, 'occupied'),
('201', 'W1', 2, 'vacant'),
('202', 'W1', 2, 'occupied'),
('301', 'W1', 3, 'vacant'),
('302', 'W1', 3, 'reserved');

-- Insert sample rooms for W2
INSERT INTO rooms (room_id, building, floor, status) VALUES
('101A', 'W2', 1, 'vacant'),
('101B', 'W2', 1, 'occupied'),
('201A', 'W2', 2, 'vacant'),
('201B', 'W2', 2, 'occupied');

-- Insert sample rooms for W3
INSERT INTO rooms (room_id, building, floor, status) VALUES
('W3_101', 'W3', 1, 'vacant'),
('W3_102', 'W3', 1, 'occupied'),
('W3_201', 'W3', 2, 'vacant'),
('W3_202', 'W3', 2, 'occupied');

-- Insert special areas
INSERT INTO rooms (room_id, building, status) VALUES
('ร้านกาแฟ', 'Other', 'occupied'),
('ร้านซักผ้า', 'Other', 'occupied'),
('มินิมาร์ท', 'Other', 'occupied');
```

### 4. Setup Storage Buckets

ใน Supabase Dashboard > Storage สร้าง buckets:
- `documents` - สำหรับเก็บไฟล์ PDF ใบแจ้งหนี้
- `repair-images` - สำหรับเก็บรูปภาพการซ่อม

### 5. Setup Authentication

1. ไปที่ Authentication > Users
2. สร้างผู้ใช้ทดสอบ:
   - Admin: `admin@wealthcondo.com`
   - Customer: `customer@wealthcondo.com`
   - Technician: `technician@wealthcondo.com`

3. เพิ่ม role ในตาราง user_roles:

```sql
-- หลังจากสร้าง user แล้ว ให้เพิ่ม role
INSERT INTO user_roles (user_id, role) VALUES
('USER_ID_ของ_ADMIN', 'admin'),
('USER_ID_ของ_CUSTOMER', 'customer'),
('USER_ID_ของ_TECHNICIAN', 'technician');
```

## 📁 โครงสร้างโฟลเดอร์

```
wealth-condo/
├── public/
│   ├── index.html        # หน้า Admin Dashboard
│   ├── login.html        # หน้า Login
│   ├── customer.html     # หน้าผู้เช่า
│   ├── technician.html   # หน้าช่างซ่อม
│   └── invoice.html      # หน้าสร้างใบแจ้งหนี้
├── js/
│   ├── supabaseClient.js # การเชื่อมต่อ Supabase
│   ├── auth.js           # ระบบ Authentication
│   ├── admin.js          # Logic หน้า Admin
│   ├── customer.js       # Logic หน้าผู้เช่า
│   ├── technician.js     # Logic หน้าช่างซ่อม
│   └── invoice.js        # Logic สร้างใบแจ้งหนี้
└── README.md
```

## 🚀 การ Deploy

### Option 1: GitHub Pages

1. Push โค้ดไปที่ GitHub repository
2. ไปที่ Settings > Pages
3. เลือก Source: Deploy from a branch
4. เลือก Branch: main, Folder: /public
5. Save และรอ deploy

### Option 2: Vercel

1. Import repository ใน Vercel
2. ตั้งค่า Root Directory: `public`
3. Deploy

## 📱 การใช้งาน

1. เข้าสู่ระบบที่ `/login.html`
2. ระบบจะ redirect ไปหน้าที่เหมาะสมตาม role:
   - Admin → Dashboard
   - Customer → หน้าข้อมูลส่วนตัว
   - Technician → หน้ารายการซ่อม

## 🔒 Security

- ใช้ Supabase Row Level Security (RLS)
- ตรวจสอบ role ก่อนแสดงข้อมูล
- ไม่เก็บข้อมูลสำคัญใน client-side

## 📞 Support

หากพบปัญหาหรือต้องการความช่วยเหลือ กรุณาติดต่อ:
- Email: support@wealthcondo.com
- Line: @wealthcondo

## 📄 License

© 2025 Wealth Condo. All rights reserved.