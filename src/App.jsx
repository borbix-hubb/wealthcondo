import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  Zap, 
  FileText, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  Droplets,
  History,
  PieChart,
  BarChart3,
  Car,
  Bike,
  CreditCard
} from 'lucide-react';

const WealthCondoApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('building1');
  const [selectedParkingType, setSelectedParkingType] = useState('car');
  
  // Generate rooms data based on building specifications
  const generateRoomsData = () => {
    const allRooms = [];
    
    // Building 1 - 15 rooms per floor (no x13 rooms), floors 2-9
    for (let floor = 2; floor <= 9; floor++) {
      for (let room = 1; room <= 16; room++) {
        if (room === 13) continue; // Skip x13 rooms
        const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
        allRooms.push({
          id: roomNumber,
          building: 'building1',
          floor: floor,
          number: roomNumber,
          status: 'vacant',
          tenant: '',
          lineId: '',
          rent: 3500,
          phone: '',
          carParking: 0,
          carPlate: '',
          motorcycleParking: 0,
          motorcyclePlate1: '',
          motorcyclePlate2: '',
          contractStart: '',
          contractEnd: ''
        });
      }
    }
    
    // Building 2A - 6 rooms per floor, floors 2-4
    for (let floor = 2; floor <= 4; floor++) {
      for (let room = 1; room <= 6; room++) {
        const roomNumber = `${floor}${room.toString().padStart(2, '0')}A`;
        allRooms.push({
          id: roomNumber,
          building: 'building2A',
          floor: floor,
          number: roomNumber,
          status: 'vacant',
          tenant: '',
          lineId: '',
          rent: 3500,
          phone: '',
          carParking: 0,
          carPlate: '',
          motorcycleParking: 0,
          motorcyclePlate1: '',
          motorcyclePlate2: '',
          contractStart: '',
          contractEnd: ''
        });
      }
    }
    
    // Building 2B - 6 rooms per floor, floors 2-4
    for (let floor = 2; floor <= 4; floor++) {
      for (let room = 1; room <= 6; room++) {
        const roomNumber = `${floor}${room.toString().padStart(2, '0')}B`;
        allRooms.push({
          id: roomNumber,
          building: 'building2B',
          floor: floor,
          number: roomNumber,
          status: 'vacant',
          tenant: '',
          lineId: '',
          rent: 3500,
          phone: '',
          carParking: 0,
          carPlate: '',
          motorcycleParking: 0,
          motorcyclePlate1: '',
          motorcyclePlate2: '',
          contractStart: '',
          contractEnd: ''
        });
      }
    }
    
    // Building 3 - Floor 1: 101-109, Floors 2-5: 201-211
    // Floor 1
    for (let room = 1; room <= 9; room++) {
      const roomNumber = `W3_1${room.toString().padStart(2, '0')}`;
      allRooms.push({
        id: roomNumber,
        building: 'building3',
        floor: 1,
        number: roomNumber,
        status: 'vacant',
        tenant: '',
        lineId: '',
        rent: 3200,
        phone: '',
        carParking: 0,
        carPlate: '',
        motorcycleParking: 0,
        motorcyclePlate1: '',
        motorcyclePlate2: '',
        contractStart: '',
        contractEnd: ''
      });
    }
    
    // Floors 2-5
    for (let floor = 2; floor <= 5; floor++) {
      for (let room = 1; room <= 11; room++) {
        const roomNumber = `W3_${floor}${room.toString().padStart(2, '0')}`;
        allRooms.push({
          id: roomNumber,
          building: 'building3',
          floor: floor,
          number: roomNumber,
          status: 'vacant',
          tenant: '',
          lineId: '',
          rent: 3200,
          phone: '',
          carParking: 0,
          carPlate: '',
          motorcycleParking: 0,
          motorcyclePlate1: '',
          motorcyclePlate2: '',
          contractStart: '',
          contractEnd: ''
        });
      }
    }
    
    return allRooms;
  };

  // Initialize with generated rooms
  const initialRooms = generateRoomsData();
  
  // Add existing tenant data to the generated rooms
  const existingTenants = [
    { id: '201', building: 'building1', floor: 2, number: '201', status: 'occupied', tenant: 'นิรดา โพธิ', lineId: 'Noomint.', rent: 3500, phone: '062-817-1267', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: '4 ขถ 3102 กทม', motorcyclePlate2: '5 กณ 233 กทม.', contractStart: '1/9/24', contractEnd: '31/8/25' },
    { id: '202', building: 'building1', floor: 2, number: '202', status: 'occupied', tenant: 'ธัญญาทิพย์ จั๋นสุข', lineId: 'Tanyatip.', rent: 3500, phone: '062-247-2717', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: 'กลก 642', motorcyclePlate2: '', contractStart: '1/9/24', contractEnd: '31/8/25' },
    { id: '203', building: 'building1', floor: 2, number: '203', status: 'occupied', tenant: 'น้าหลิน', lineId: 'น้าหลิน.', rent: 3500, phone: '', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '', contractEnd: '' },
    { id: '204', building: 'building1', floor: 2, number: '204', status: 'occupied', tenant: 'สุริยัน รัตนกร', lineId: 'พี่บี.', rent: 3500, phone: '088-559-1696', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '1/12/24', contractEnd: '30/11/25' },
    { id: '205', building: 'building1', floor: 2, number: '205', status: 'occupied', tenant: 'ฮารีส ยาแม', lineId: 'Haris.', rent: 3500, phone: '063-250-2701', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: '1 กด 989', motorcyclePlate2: '', contractStart: '1/9/24', contractEnd: '31/8/25' },
    { id: '206', building: 'building1', floor: 2, number: '206', status: 'occupied', tenant: 'วิลาวัลย์ กัณฐัศว์กำพล', lineId: 'Stamp.', rent: 3500, phone: '061-391-0577', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: '4 กญ 6560', motorcyclePlate2: '', contractStart: '1/9/24', contractEnd: '31/8/25' },
    { id: '207', building: 'building1', floor: 2, number: '207', status: 'occupied', tenant: 'สุรัยยา บากา', lineId: 'Suraiya.', rent: 3500, phone: '061-2475002', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: '8 ขณ 3503', motorcyclePlate2: '', contractStart: '1/3/25', contractEnd: '28/2/26' },
    { id: '208', building: 'building1', floor: 2, number: '208', status: 'vacant', tenant: '', lineId: 'Potchana/', rent: 3500, phone: '', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '', contractEnd: '' },
    { id: '209', building: 'building1', floor: 2, number: '209', status: 'occupied', tenant: 'เนตรนภา คำวงษ์', lineId: 'b.', rent: 3500, phone: '061-427-4054', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '1/9/24', contractEnd: '31/8/25' },
    { id: '210', building: 'building1', floor: 2, number: '210', status: 'occupied', tenant: 'เอกพจน์ สุขเฉลิมศรี', lineId: 'ทองเอก.', rent: 2500, phone: '084-356-0969', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: 'ปตม 344 กทม', motorcyclePlate2: '', contractStart: '1/8/25', contractEnd: '31/7/26' },
    { id: '212', building: 'building1', floor: 2, number: '212', status: 'occupied', tenant: 'นาง มง มง', lineId: 'วันใหม่.', rent: 4000, phone: '066-065-5715', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '1/7/25', contractEnd: '30/6/26' },
    { id: '214', building: 'building1', floor: 2, number: '214', status: 'occupied', tenant: 'ทศพล บรรเทา', lineId: 'knbeloved.', rent: 3500, phone: '089-464-4636', carParking: 1000, carPlate: '6ขข2177', motorcycleParking: 200, motorcyclePlate1: '8 ขฒ 6565', motorcyclePlate2: '', contractStart: '1/9/24', contractEnd: '31/8/25' },
    { id: '215', building: 'building1', floor: 2, number: '215', status: 'occupied', tenant: 'ห้องป้า.', lineId: 'ห้องป้า.', rent: 0, phone: '', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '', contractEnd: '' },
    { id: '216', building: 'building1', floor: 2, number: '216', status: 'occupied', tenant: 'ปุณญพิชญ์ กาติ๊บ', lineId: 'Ctoon.', rent: 3500, phone: '099-193-3122', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: '1กฌ 7415 พะเยา', motorcyclePlate2: '', contractStart: '1/9/24', contractEnd: '31/8/25' },
    { id: '301', building: 'building1', floor: 3, number: '301', status: 'occupied', tenant: 'ก้านแก้ว สายจันทร์', lineId: 'Natchakarn 🩵🍩🤎.', rent: 3500, phone: '061-520-1223', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: '1 กผ 7863', motorcyclePlate2: '', contractStart: '1/8/25', contractEnd: '31/7/26' },
    { id: '302', building: 'building1', floor: 3, number: '302', status: 'occupied', tenant: 'อิสระภาพ มูลพงษ์', lineId: 'J.', rent: 3500, phone: '062-303-3870', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '1/2/25', contractEnd: '31/1/26' },
    { id: '303', building: 'building1', floor: 3, number: '303', status: 'occupied', tenant: 'วนิดา ก้อนทอง', lineId: 'chompu.', rent: 3500, phone: '062-438-6901', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '1/8/24', contractEnd: '31/7/25' },
    { id: '304', building: 'building1', floor: 3, number: '304', status: 'occupied', tenant: 'ศุภมาศ ยอดเต็มคงคา', lineId: 'supamas.', rent: 3500, phone: '092-939-5930', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: '1กฉ1605', motorcyclePlate2: '', contractStart: '1/8/24', contractEnd: '31/7/25' },
    { id: '305', building: 'building1', floor: 3, number: '305', status: 'occupied', tenant: 'อับดุลฮากีม อาลีมามะ', lineId: 'PAN.', rent: 3500, phone: '081-783-2617', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: '7 ขญ 813 กทม', motorcyclePlate2: '', contractStart: '1/5/25', contractEnd: '30/4/26' },
    { id: '201A', building: 'building2A', floor: 2, number: '201A', status: 'occupied', tenant: 'ปิยธิดา จันทร์พิลา', lineId: 'ดาวแมคโดนัล.', rent: 3500, phone: '089-944-3091', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '1/8/25', contractEnd: '31/7/26' },
    { id: '202A', building: 'building2A', floor: 2, number: '202A', status: 'occupied', tenant: 'เอื้องนิสา มูหะหมัด', lineId: 'นิสา.', rent: 3500, phone: '062-476-0726', carParking: 1000, carPlate: '2ขค300,1ขง3625', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '1/8/24', contractEnd: '31/7/25' },
    { id: '203A', building: 'building2A', floor: 2, number: '203A', status: 'occupied', tenant: 'ดวงฤดี พรมขวัญ', lineId: 'wanz.', rent: 3000, phone: '098-832-0461', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '1/8/25', contractEnd: '31/7/26' },
    { id: '204A', building: 'building2A', floor: 2, number: '204A', status: 'occupied', tenant: 'รัญย์ญาลิลล์ คนโทฉิมพลี', lineId: 'runyalil.', rent: 3500, phone: '096-326-1445', carParking: 1000, carPlate: '4ขธ298', motorcycleParking: 200, motorcyclePlate1: '7 ขฆ 481 กทม.', motorcyclePlate2: '', contractStart: '1/8/25', contractEnd: '31/7/26' },
    { id: '201B', building: 'building2B', floor: 2, number: '201B', status: 'occupied', tenant: 'อดิศร แสงนัยนา', lineId: 'adison.', rent: 3500, phone: '086-915-4365', carParking: 1000, carPlate: '3กอ4611', motorcycleParking: 200, motorcyclePlate1: '9 กฆ 6383 กทม.', motorcyclePlate2: '', contractStart: '1/8/24', contractEnd: '31/7/25' },
    { id: '202B', building: 'building2B', floor: 2, number: '202B', status: 'occupied', tenant: 'ณลตา สร้อยทอง', lineId: 'พี่อุ๊.', rent: 3500, phone: '087-919-5265', carParking: 1000, carPlate: '5กช4346', motorcycleParking: 200, motorcyclePlate1: '2 กฆ 3918 กทม.', motorcyclePlate2: '5 กว 7484', contractStart: '1/8/24', contractEnd: '31/7/25' },
    { id: '203B', building: 'building2B', floor: 2, number: '203B', status: 'occupied', tenant: 'ปรเมศวร์ เขื่อนแก้ว', lineId: 'Px.', rent: 3000, phone: '090-321-1897', carParking: 1000, carPlate: 'กล6477', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '1/8/24', contractEnd: '31/7/25' },
    { id: 'W3_101', building: 'building3', floor: 1, number: 'W3_101', status: 'occupied', tenant: 'วันเพ็ญ หยิกประเสริฐ', lineId: 'ป้าแจง.', rent: 2000, phone: '', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '', contractEnd: '' },
    { id: 'W3_102', building: 'building3', floor: 1, number: 'W3_102', status: 'occupied', tenant: 'จอมขวัญเรือน ป้องหอม', lineId: '🌴Zor❤️.', rent: 3200, phone: '094-152-9561', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: 'ภช 6488 ปราณบุรี', motorcyclePlate2: '', contractStart: '1/2/25', contractEnd: '31/1/26' },
    { id: 'W3_103', building: 'building3', floor: 1, number: 'W3_103', status: 'occupied', tenant: 'รุสมีนา เว๊าะแจ', lineId: 'miinaaaa.', rent: 3200, phone: '098-047-6507', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: '2กข 3355 สงขลา', motorcyclePlate2: '', contractStart: '1/2/25', contractEnd: '31/1/26' },
    { id: 'W3_104', building: 'building3', floor: 1, number: 'W3_104', status: 'occupied', tenant: 'นินัสมีย์ อาแว', lineId: 'jaomi.', rent: 3200, phone: '080-707-4297', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '1/3/25', contractEnd: '28/2/26' },
    { id: 'W3_105', building: 'building3', floor: 1, number: 'W3_105', status: 'occupied', tenant: 'นูรฮาฟาติน ยะโกะ', lineId: 'ftins ¹⁹⁸⁵⁵.', rent: 3200, phone: '093-6033376', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '1/3/25', contractEnd: '28/2/26' },
    { id: 'W3_201', building: 'building3', floor: 2, number: 'W3_201', status: 'occupied', tenant: 'วราลี ตาลอุทัย', lineId: 'Gift.', rent: 3200, phone: '061-897-8285', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '', contractEnd: '' },
    { id: 'W3_202', building: 'building3', floor: 2, number: 'W3_202', status: 'occupied', tenant: 'Saw Thein Zaw', lineId: 'Sor_papike.', rent: 3200, phone: '099-162-6005', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: 'ฬธน 544 กทม', motorcyclePlate2: '', contractStart: '1/2/25', contractEnd: '31/1/26' },
    { id: 'W3_410', building: 'building3', floor: 4, number: 'W3_410', status: 'vacant', tenant: '', lineId: 'P.', rent: 3200, phone: '', carParking: 0, carPlate: '', motorcycleParking: 200, motorcyclePlate1: '2 กก 5671 ระยอง', motorcyclePlate2: '', contractStart: '1/2/25', contractEnd: '31/1/26' },
    { id: '503', building: 'building1', floor: 5, number: '503', status: 'vacant', tenant: '', lineId: 'Nun.', rent: 3500, phone: '', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '', contractEnd: '' },
    { id: '505', building: 'building1', floor: 5, number: '505', status: 'vacant', tenant: '', lineId: 'Nattanon/', rent: 3500, phone: '', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '', contractEnd: '' },
    { id: '403A', building: 'building2A', floor: 4, number: '403A', status: 'vacant', tenant: '', lineId: '', rent: 3500, phone: '', carParking: 0, carPlate: '', motorcycleParking: 0, motorcyclePlate1: '', motorcyclePlate2: '', contractStart: '', contractEnd: '' },
  ];
  
  // Merge existing tenant data with generated rooms
  existingTenants.forEach(tenant => {
    const index = initialRooms.findIndex(room => room.id === tenant.id);
    if (index !== -1) {
      initialRooms[index] = tenant;
    }
  });
  
  const [rooms, setRooms] = useState(initialRooms);

  // Mock data for utility bills
  const [utilityBills, setUtilityBills] = useState([
    { id: 1, roomId: '201', month: '2024-06', electricity: 450, water: 120, date: '2024-06-30' },
    { id: 2, roomId: '201', month: '2024-05', electricity: 380, water: 110, date: '2024-05-31' },
    { id: 3, roomId: '202', month: '2024-06', electricity: 520, water: 140, date: '2024-06-30' },
    { id: 4, roomId: 'W3_101', month: '2024-06', electricity: 410, water: 125, date: '2024-06-30' },
    { id: 5, roomId: '201A', month: '2024-06', electricity: 380, water: 115, date: '2024-06-30' },
  ]);

  const [newBill, setNewBill] = useState({
    roomId: '',
    month: '',
    electricity: '',
    water: '',
    date: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied': return 'bg-blue-500 hover:bg-blue-600';
      case 'vacant': return 'bg-gray-300 hover:bg-gray-400';
      case 'moving-in': return 'bg-green-500 hover:bg-green-600';
      case 'moving-out': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'occupied': return 'ไม่ว่าง';
      case 'vacant': return 'ว่าง';
      case 'moving-in': return 'กำลังย้ายเข้า';
      case 'moving-out': return 'กำลังย้ายออก';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  const getBuildingName = (building) => {
    switch (building) {
      case 'building1': return 'ตึกที่ 1';
      case 'building2A': return 'ตึกที่ 2 - ฝั่ง A';
      case 'building2B': return 'ตึกที่ 2 - ฝั่ง B';
      case 'building3': return 'ตึกที่ 3 (W3)';
      default: return building;
    }
  };

  const getFloorsByBuilding = (building) => {
    const buildingRooms = rooms.filter(room => room.building === building);
    const floors = [...new Set(buildingRooms.map(room => room.floor))].sort((a, b) => b - a);
    return floors;
  };

  const getRoomsByBuildingAndFloor = (building, floor) => {
    return rooms.filter(room => room.building === building && room.floor === floor)
                .sort((a, b) => a.number.localeCompare(b.number));
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
    setModalType('room-detail');
  };

  const handleAddBill = () => {
    setNewBill({
      roomId: '',
      month: new Date().toISOString().slice(0, 7),
      electricity: '',
      water: '',
      date: new Date().toISOString().slice(0, 10)
    });
    setShowModal(true);
    setModalType('add-bill');
  };

  const saveBill = () => {
    if (newBill.roomId && newBill.month && newBill.electricity && newBill.water) {
      const bill = {
        id: Date.now(),
        ...newBill,
        electricity: parseFloat(newBill.electricity),
        water: parseFloat(newBill.water)
      };
      setUtilityBills([bill, ...utilityBills]);
      setShowModal(false);
      setNewBill({ roomId: '', month: '', electricity: '', water: '', date: '' });
    }
  };

  const updateRoomStatus = (roomId, newStatus) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, status: newStatus } : room
    ));
    setShowModal(false);
  };

  const getTotalStats = () => {
    const total = rooms.length;
    const occupied = rooms.filter(r => r.status === 'occupied').length;
    const vacant = rooms.filter(r => r.status === 'vacant').length;
    const moving = rooms.filter(r => r.status === 'moving-in' || r.status === 'moving-out').length;
    
    return { total, occupied, vacant, moving };
  };

  // Generate parking spaces from room data
  const generateParkingSpaces = () => {
    const carSpaces = [];
    const motorcycleSpaces = [];
    
    // Add car parking spaces
    rooms.forEach(room => {
      if (room.carParking > 0 && room.carPlate) {
        carSpaces.push({
          id: `CAR-${room.id}`,
          type: 'car',
          roomId: room.id,
          status: 'occupied',
          plate: room.carPlate,
          tenant: room.tenant,
          position: { row: Math.floor(carSpaces.length / 10) + 1, col: (carSpaces.length % 10) + 1 }
        });
      }
    });
    
    // Add some empty car spaces
    for (let i = carSpaces.length; i < 50; i++) {
      carSpaces.push({
        id: `CAR-EMPTY-${i + 1}`,
        type: 'car',
        roomId: null,
        status: 'vacant',
        plate: '',
        tenant: '',
        position: { row: Math.floor(i / 10) + 1, col: (i % 10) + 1 }
      });
    }
    
    // Add motorcycle parking spaces
    rooms.forEach(room => {
      if (room.motorcycleParking > 0) {
        if (room.motorcyclePlate1) {
          motorcycleSpaces.push({
            id: `BIKE-${room.id}-1`,
            type: 'motorcycle',
            roomId: room.id,
            status: 'occupied',
            plate: room.motorcyclePlate1,
            tenant: room.tenant,
            position: { row: Math.floor(motorcycleSpaces.length / 15) + 1, col: (motorcycleSpaces.length % 15) + 1 }
          });
        }
        if (room.motorcyclePlate2) {
          motorcycleSpaces.push({
            id: `BIKE-${room.id}-2`,
            type: 'motorcycle',
            roomId: room.id,
            status: 'occupied',
            plate: room.motorcyclePlate2,
            tenant: room.tenant,
            position: { row: Math.floor(motorcycleSpaces.length / 15) + 1, col: (motorcycleSpaces.length % 15) + 1 }
          });
        }
      }
    });
    
    // Add empty motorcycle spaces
    for (let i = motorcycleSpaces.length; i < 100; i++) {
      motorcycleSpaces.push({
        id: `BIKE-EMPTY-${i + 1}`,
        type: 'motorcycle',
        roomId: null,
        status: 'vacant',
        plate: '',
        tenant: '',
        position: { row: Math.floor(i / 15) + 1, col: (i % 15) + 1 }
      });
    }
    
    return { carSpaces, motorcycleSpaces };
  };

  const menuItems = [
    { id: 'dashboard', name: 'หน้าหลัก', icon: Home },
    { id: 'rooms', name: 'ผังห้อง', icon: Building },
    { id: 'parking', name: 'ที่จอดรถ', icon: Car },
    { id: 'tenants', name: 'ผู้เช่า', icon: Users },
    { id: 'utilities', name: 'ค่าน้ำไฟ', icon: Zap },
    { id: 'reports', name: 'รายงาน', icon: FileText },
    { id: 'settings', name: 'ตั้งค่า', icon: Settings },
  ];

  const stats = getTotalStats();

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">ห้องทั้งหมด</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Building className="h-12 w-12 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">ห้องที่มีผู้เช่า</p>
              <p className="text-3xl font-bold text-green-600">{stats.occupied}</p>
            </div>
            <Users className="h-12 w-12 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">ห้องว่าง</p>
              <p className="text-3xl font-bold text-gray-600">{stats.vacant}</p>
            </div>
            <Home className="h-12 w-12 text-gray-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">อัตราการเช่า</p>
              <p className="text-3xl font-bold text-yellow-600">
                {Math.round((stats.occupied / stats.total) * 100)}%
              </p>
            </div>
            <PieChart className="h-12 w-12 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Building Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">ตึกที่ 1</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>ทั้งหมด:</span>
              <span className="font-semibold">{rooms.filter(r => r.building === 'building1').length} ห้อง</span>
            </div>
            <div className="flex justify-between">
              <span>ไม่ว่าง:</span>
              <span className="font-semibold text-green-600">{rooms.filter(r => r.building === 'building1' && r.status === 'occupied').length}</span>
            </div>
            <div className="flex justify-between">
              <span>ว่าง:</span>
              <span className="font-semibold text-gray-600">{rooms.filter(r => r.building === 'building1' && r.status === 'vacant').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">ตึกที่ 2A</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>ทั้งหมด:</span>
              <span className="font-semibold">{rooms.filter(r => r.building === 'building2A').length} ห้อง</span>
            </div>
            <div className="flex justify-between">
              <span>ไม่ว่าง:</span>
              <span className="font-semibold text-green-600">{rooms.filter(r => r.building === 'building2A' && r.status === 'occupied').length}</span>
            </div>
            <div className="flex justify-between">
              <span>ว่าง:</span>
              <span className="font-semibold text-gray-600">{rooms.filter(r => r.building === 'building2A' && r.status === 'vacant').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">ตึกที่ 2B</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>ทั้งหมด:</span>
              <span className="font-semibold">{rooms.filter(r => r.building === 'building2B').length} ห้อง</span>
            </div>
            <div className="flex justify-between">
              <span>ไม่ว่าง:</span>
              <span className="font-semibold text-green-600">{rooms.filter(r => r.building === 'building2B' && r.status === 'occupied').length}</span>
            </div>
            <div className="flex justify-between">
              <span>ว่าง:</span>
              <span className="font-semibold text-gray-600">{rooms.filter(r => r.building === 'building2B' && r.status === 'vacant').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">ตึกที่ 3 (W3)</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>ทั้งหมด:</span>
              <span className="font-semibold">{rooms.filter(r => r.building === 'building3').length} ห้อง</span>
            </div>
            <div className="flex justify-between">
              <span>ไม่ว่าง:</span>
              <span className="font-semibold text-green-600">{rooms.filter(r => r.building === 'building3' && r.status === 'occupied').length}</span>
            </div>
            <div className="flex justify-between">
              <span>ว่าง:</span>
              <span className="font-semibold text-gray-600">{rooms.filter(r => r.building === 'building3' && r.status === 'vacant').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">ผังห้องพัก</h2>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm">ไม่ว่าง</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span className="text-sm">ว่าง</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">กำลังย้ายเข้า</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">กำลังย้ายออก</span>
          </div>
        </div>
      </div>

      {/* Building Selection */}
      <div className="flex space-x-2 mb-6">
        {['building1', 'building2A', 'building2B', 'building3'].map(building => (
          <button
            key={building}
            onClick={() => setSelectedBuilding(building)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedBuilding === building
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm'
            }`}
          >
            {getBuildingName(building)}
          </button>
        ))}
      </div>
      
      {/* Floors for selected building */}
      {getFloorsByBuilding(selectedBuilding).map(floor => (
        <div key={`${selectedBuilding}-${floor}`} className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Building className="mr-2" />
            {getBuildingName(selectedBuilding)} - ชั้น {floor}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {getRoomsByBuildingAndFloor(selectedBuilding, floor).map(room => (
              <div
                key={room.id}
                className={`${getStatusColor(room.status)} text-white p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-md`}
                onClick={() => handleRoomClick(room)}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">{room.number}</div>
                  <div className="text-sm opacity-90">{getStatusText(room.status)}</div>
                  {room.tenant && (
                    <div className="text-xs opacity-80 mt-1 truncate">{room.tenant}</div>
                  )}
                  {room.rent > 0 && (
                    <div className="text-xs opacity-80 mt-1">{room.rent.toLocaleString()} บาท</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderParking = () => {
    const { carSpaces, motorcycleSpaces } = generateParkingSpaces();
    
    const handleParkingSpaceClick = (space) => {
      if (space.status === 'occupied') {
        // Find the room for this parking space
        const room = rooms.find(r => r.id === space.roomId);
        if (room) {
          setSelectedRoom(room);
          setShowModal(true);
          setModalType('room-detail');
        }
      }
    };
    
    const getParkingColor = (status) => {
      return status === 'occupied' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-400 hover:bg-green-500';
    };
    
    const currentSpaces = selectedParkingType === 'car' ? carSpaces : motorcycleSpaces;
    const maxCols = selectedParkingType === 'car' ? 10 : 15;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">ผังที่จอดรถ</h2>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">ไม่ว่าง</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-sm">ว่าง</span>
            </div>
          </div>
        </div>

        {/* Parking Type Selection */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setSelectedParkingType('car')}
            className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
              selectedParkingType === 'car'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm'
            }`}
          >
            <Car className="h-5 w-5" />
            <span>ที่จอดรถยนต์</span>
          </button>
          <button
            onClick={() => setSelectedParkingType('motorcycle')}
            className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
              selectedParkingType === 'motorcycle'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm'
            }`}
          >
            <Bike className="h-5 w-5" />
            <span>ที่จอดรถจักรยานยนต์</span>
          </button>
        </div>

        {/* Parking Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">
                  {selectedParkingType === 'car' ? 'ที่จอดรถยนต์' : 'ที่จอดมอเตอร์ไซค์'}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentSpaces.length}
                </p>
              </div>
              {selectedParkingType === 'car' ? 
                <Car className="h-8 w-8 text-blue-500" /> : 
                <Bike className="h-8 w-8 text-blue-500" />
              }
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">ไม่ว่าง</p>
                <p className="text-2xl font-bold text-red-600">
                  {currentSpaces.filter(s => s.status === 'occupied').length}
                </p>
              </div>
              <X className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">ว่าง</p>
                <p className="text-2xl font-bold text-green-600">
                  {currentSpaces.filter(s => s.status === 'vacant').length}
                </p>
              </div>
              <Plus className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">อัตราใช้งาน</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round((currentSpaces.filter(s => s.status === 'occupied').length / currentSpaces.length) * 100)}%
                </p>
              </div>
              <PieChart className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Parking Layout */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            {selectedParkingType === 'car' ? <Car className="mr-2" /> : <Bike className="mr-2" />}
            ผัง{selectedParkingType === 'car' ? 'ที่จอดรถยนต์' : 'ที่จอดรถจักรยานยนต์'}
          </h3>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div 
                className="grid gap-2 p-4"
                style={{ 
                  gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
                  minWidth: selectedParkingType === 'car' ? '800px' : '1200px'
                }}
              >
                {currentSpaces.map((space, index) => (
                  <div
                    key={space.id}
                    className={`
                      ${getParkingColor(space.status)} 
                      text-white p-3 rounded-lg cursor-pointer 
                      transition-all duration-200 transform hover:scale-105 
                      shadow-md text-center relative
                      ${selectedParkingType === 'car' ? 'h-16 w-20' : 'h-12 w-16'}
                    `}
                    onClick={() => handleParkingSpaceClick(space)}
                    title={space.status === 'occupied' ? 
                      `ห้อง ${space.roomId} - ${space.plate} - ${space.tenant}` : 
                      'ที่จอดว่าง'
                    }
                  >
                    <div className="text-xs font-bold">
                      {selectedParkingType === 'car' ? 'C' : 'M'}{index + 1}
                    </div>
                    {space.status === 'occupied' && (
                      <>
                        <div className="text-xs opacity-90 truncate">
                          {space.roomId}
                        </div>
                        <div className="text-xs opacity-80 truncate">
                          {space.plate}
                        </div>
                      </>
                    )}
                    {space.status === 'vacant' && (
                      <div className="text-xs opacity-80">ว่าง</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Parking Details List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">
              รายการ{selectedParkingType === 'car' ? 'ที่จอดรถยนต์' : 'ที่จอดรถจักรยานยนต์'}ที่ใช้งาน
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ช่อง</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ห้อง</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ทะเบียน</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้เช่า</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ค่าจอด/เดือน</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentSpaces
                  .filter(space => space.status === 'occupied')
                  .map((space) => {
                    const room = rooms.find(r => r.id === space.roomId);
                    const parkingFee = selectedParkingType === 'car' ? room?.carParking : room?.motorcycleParking;
                    
                    return (
                      <tr key={space.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {selectedParkingType === 'car' ? 'C' : 'M'}{currentSpaces.indexOf(space) + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{space.roomId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{space.plate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{space.tenant}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                          {parkingFee ? `${parkingFee.toLocaleString()} บาท` : '-'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTenants = () => (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">รายชื่อผู้เช่า</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ห้อง</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อผู้เช่า</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ไลน์ ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทร</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ค่าห้อง</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันหมดสัญญา</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.filter(room => room.tenant).map(room => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{room.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.tenant}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.lineId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.rent.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.contractEnd}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    room.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                    room.status === 'moving-in' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getStatusText(room.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUtilities = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">ค่าน้ำค่าไฟ</h2>
        <button
          onClick={handleAddBill}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>เพิ่มบิล</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ห้อง</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เดือน/ปี</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ค่าไฟ (บาท)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ค่าน้ำ (บาท)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รวม (บาท)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่บันทึก</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {utilityBills.map(bill => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.roomId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.electricity.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.water.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {(bill.electricity + bill.water).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">รายงาน</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChart className="mr-2 text-blue-600" />
            สถิติการเช่าแยกตามตึก
          </h3>
          <div className="space-y-4">
            {['building1', 'building2A', 'building2B', 'building3'].map(building => {
              const buildingRooms = rooms.filter(r => r.building === building);
              const occupied = buildingRooms.filter(r => r.status === 'occupied').length;
              const total = buildingRooms.length;
              const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
              
              return (
                <div key={building} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{getBuildingName(building)}:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{occupied}/{total}</span>
                    <span className="text-sm font-semibold text-blue-600">({rate}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="mr-2 text-blue-600" />
            รายได้ค่าห้อง (เดือน)
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>รายได้รวม:</span>
              <span className="font-semibold text-blue-600">
                {rooms
                  .filter(room => room.status === 'occupied' && room.rent > 0)
                  .reduce((sum, room) => sum + room.rent, 0)
                  .toLocaleString()} บาท
              </span>
            </div>
            <div className="flex justify-between">
              <span>ค่าห้องเฉลี่ย:</span>
              <span className="font-semibold text-green-600">
                {Math.round(
                  rooms
                    .filter(room => room.rent > 0)
                    .reduce((sum, room) => sum + room.rent, 0) / 
                  rooms.filter(room => room.rent > 0).length
                ).toLocaleString()} บาท
              </span>
            </div>
            <div className="flex justify-between">
              <span>รายได้ค่าจอดรถ:</span>
              <span className="font-semibold text-orange-600">
                {rooms
                  .filter(room => room.status === 'occupied')
                  .reduce((sum, room) => sum + room.carParking + room.motorcycleParking, 0)
                  .toLocaleString()} บาท
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    if (modalType === 'room-detail' && selectedRoom) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">ห้อง {selectedRoom.id}</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">สถานะปัจจุบัน</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedRoom.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                    selectedRoom.status === 'vacant' ? 'bg-gray-100 text-gray-800' :
                    selectedRoom.status === 'moving-in' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getStatusText(selectedRoom.status)}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ค่าห้อง</label>
                  <p className="text-gray-900 font-semibold">{selectedRoom.rent.toLocaleString()} บาท</p>
                </div>

                {selectedRoom.tenant && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ผู้เช่า</label>
                      <p className="text-gray-900">{selectedRoom.tenant}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ไลน์ ID</label>
                      <p className="text-gray-900">{selectedRoom.lineId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                      <p className="text-gray-900">{selectedRoom.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มสัญญา</label>
                      <p className="text-gray-900">{selectedRoom.contractStart}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">วันที่หมดสัญญา</label>
                      <p className="text-gray-900">{selectedRoom.contractEnd}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4">
                {/* Parking Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
                    <Car className="mr-2 h-4 w-4" />
                    ข้อมูลการจอดรถ
                  </h4>
                  
                  {selectedRoom.carParking > 0 && (
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">ค่าจอดรถยนต์</label>
                      <p className="text-gray-900">{selectedRoom.carParking.toLocaleString()} บาท</p>
                      {selectedRoom.carPlate && (
                        <p className="text-sm text-gray-600">ทะเบียน: {selectedRoom.carPlate}</p>
                      )}
                    </div>
                  )}
                  
                  {selectedRoom.motorcycleParking > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ค่าจอดรถจักรยานยนต์</label>
                      <p className="text-gray-900">{selectedRoom.motorcycleParking.toLocaleString()} บาท</p>
                      {selectedRoom.motorcyclePlate1 && (
                        <p className="text-sm text-gray-600">ทะเบียน 1: {selectedRoom.motorcyclePlate1}</p>
                      )}
                      {selectedRoom.motorcyclePlate2 && (
                        <p className="text-sm text-gray-600">ทะเบียน 2: {selectedRoom.motorcyclePlate2}</p>
                      )}
                    </div>
                  )}
                  
                  {selectedRoom.carParking === 0 && selectedRoom.motorcycleParking === 0 && (
                    <p className="text-gray-500 text-sm">ไม่มีการจอดรถ</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เปลี่ยนสถานะ</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateRoomStatus(selectedRoom.id, 'occupied')}
                      className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                    >
                      ไม่ว่าง
                    </button>
                    <button
                      onClick={() => updateRoomStatus(selectedRoom.id, 'vacant')}
                      className="bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
                    >
                      ว่าง
                    </button>
                    <button
                      onClick={() => updateRoomStatus(selectedRoom.id, 'moving-in')}
                      className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
                    >
                      กำลังย้ายเข้า
                    </button>
                    <button
                      onClick={() => updateRoomStatus(selectedRoom.id, 'moving-out')}
                      className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                    >
                      กำลังย้ายออก
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (modalType === 'add-bill') {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">เพิ่มบิลค่าน้ำไฟ</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ห้อง</label>
                <select
                  value={newBill.roomId}
                  onChange={(e) => setNewBill({...newBill, roomId: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">เลือกห้อง</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.id} - {room.tenant || 'ห้องว่าง'}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เดือน/ปี</label>
                <input
                  type="month"
                  value={newBill.month}
                  onChange={(e) => setNewBill({...newBill, month: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ค่าไฟ (บาท)</label>
                <input
                  type="number"
                  value={newBill.electricity}
                  onChange={(e) => setNewBill({...newBill, electricity: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ค่าน้ำ (บาท)</label>
                <input
                  type="number"
                  value={newBill.water}
                  onChange={(e) => setNewBill({...newBill, water: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่บันทึก</label>
                <input
                  type="date"
                  value={newBill.date}
                  onChange={(e) => setNewBill({...newBill, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={saveBill}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>บันทึก</span>
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return renderDashboard();
      case 'rooms': return renderRooms();
      case 'parking': return renderParking();
      case 'tenants': return renderTenants();
      case 'utilities': return renderUtilities();
      case 'reports': return renderReports();
      case 'settings': return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ตั้งค่าระบบ</h2>
          <p className="text-gray-600">ฟีเจอร์การตั้งค่าจะพัฒนาในเวอร์ชันถัดไป</p>
        </div>
      );
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Wealth Condo</h1>
                <p className="text-sm text-gray-600">ระบบจัดการคอนโดมิเนียม</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString('th-TH', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen border-r border-blue-100">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default WealthCondoApp;