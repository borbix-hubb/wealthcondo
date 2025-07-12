let currentBuilding = null;
let allRooms = [];
let allCustomers = [];

async function loadDashboardData() {
    try {
        const { data: rooms, error: roomsError } = await supabase
            .from('rooms')
            .select('*');
        
        if (roomsError) throw roomsError;
        
        allRooms = rooms || [];
        
        const { data: customers, error: customersError } = await supabase
            .from('customers')
            .select('*');
        
        if (customersError) throw customersError;
        
        allCustomers = customers || [];
        
        updateDashboardStats();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateDashboardStats() {
    const totalRooms = allRooms.filter(r => r.building !== 'Other').length;
    const occupiedRooms = allRooms.filter(r => r.status === 'occupied' && r.building !== 'Other').length;
    const vacantRooms = allRooms.filter(r => r.status === 'vacant' && r.building !== 'Other').length;
    const reservedRooms = allRooms.filter(r => r.status === 'reserved' && r.building !== 'Other').length;
    
    document.getElementById('totalRooms').textContent = totalRooms;
    document.getElementById('occupiedRooms').textContent = occupiedRooms;
    document.getElementById('vacantRooms').textContent = vacantRooms;
    document.getElementById('reservedRooms').textContent = reservedRooms;
}

function showBuilding(building) {
    currentBuilding = building;
    
    document.querySelectorAll('.building-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600');
        btn.classList.add('bg-blue-500');
    });
    
    event.target.classList.remove('bg-blue-500');
    event.target.classList.add('bg-blue-600');
    
    const buildingTitle = document.getElementById('buildingTitle');
    const roomsGrid = document.getElementById('roomsGrid');
    
    if (building === 'Other') {
        buildingTitle.textContent = 'พื้นที่อื่นๆ';
    } else {
        buildingTitle.textContent = `ตึก ${building}`;
    }
    
    const buildingRooms = allRooms.filter(room => room.building === building);
    
    roomsGrid.innerHTML = '';
    
    if (building === 'Other') {
        buildingRooms.forEach(room => {
            const roomCard = createSpecialAreaCard(room);
            roomsGrid.appendChild(roomCard);
        });
    } else {
        const floors = [...new Set(buildingRooms.map(r => r.floor))].sort((a, b) => b - a);
        
        floors.forEach(floor => {
            const floorLabel = document.createElement('div');
            floorLabel.className = 'col-span-full text-lg font-bold bg-gray-200 p-2 rounded';
            floorLabel.textContent = `ชั้น ${floor}`;
            roomsGrid.appendChild(floorLabel);
            
            const floorRooms = buildingRooms.filter(r => r.floor === floor).sort((a, b) => {
                const aNum = parseInt(a.room_id.replace(/\D/g, ''));
                const bNum = parseInt(b.room_id.replace(/\D/g, ''));
                return aNum - bNum;
            });
            
            floorRooms.forEach(room => {
                const roomCard = createRoomCard(room);
                roomsGrid.appendChild(roomCard);
            });
        });
    }
}

function createRoomCard(room) {
    const div = document.createElement('div');
    div.className = 'border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg text-center';
    
    if (room.status === 'occupied') {
        div.classList.add('border-green-500', 'bg-green-50');
    } else if (room.status === 'vacant') {
        div.classList.add('border-yellow-500', 'bg-yellow-50');
    } else if (room.status === 'reserved') {
        div.classList.add('border-orange-500', 'bg-orange-50');
    }
    
    const customer = allCustomers.find(c => c.room_id === room.room_id);
    
    div.innerHTML = `
        <div class="font-bold text-lg">${room.room_id}</div>
        <div class="text-sm mt-1">
            ${room.status === 'occupied' ? '<i class="fas fa-user text-green-600"></i>' : 
              room.status === 'vacant' ? '<i class="fas fa-door-open text-yellow-600"></i>' : 
              '<i class="fas fa-bookmark text-orange-600"></i>'}
        </div>
        ${customer ? `<div class="text-xs mt-1 truncate">${customer.name}</div>` : ''}
    `;
    
    div.onclick = () => showRoomDetails(room);
    
    return div;
}

function createSpecialAreaCard(room) {
    const div = document.createElement('div');
    div.className = 'border-2 border-gray-400 bg-gray-50 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg';
    
    div.innerHTML = `
        <div class="font-bold">${room.room_id}</div>
        <div class="text-sm text-gray-600 mt-1">
            <i class="fas fa-store"></i> พื้นที่พิเศษ
        </div>
    `;
    
    div.onclick = () => showRoomDetails(room);
    
    return div;
}

async function showRoomDetails(room) {
    const modal = document.getElementById('roomModal');
    const modalRoomId = document.getElementById('modalRoomId');
    const modalContent = document.getElementById('modalContent');
    
    modalRoomId.textContent = room.room_id;
    
    if (room.building === 'Other') {
        modalContent.innerHTML = `
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded">
                    <p class="font-semibold">ประเภท: พื้นที่พิเศษ</p>
                </div>
            </div>
        `;
    } else {
        const customer = allCustomers.find(c => c.room_id === room.room_id);
        
        let content = `
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded">
                    <p class="font-semibold">สถานะ: 
                        <span class="${room.status === 'occupied' ? 'text-green-600' : 
                                      room.status === 'vacant' ? 'text-yellow-600' : 
                                      'text-orange-600'}">
                            ${room.status === 'occupied' ? 'มีผู้เช่า' : 
                              room.status === 'vacant' ? 'ว่าง' : 'จองแล้ว'}
                        </span>
                    </p>
                    <p>ตึก: ${room.building}</p>
                    <p>ชั้น: ${room.floor}</p>
                </div>
        `;
        
        if (customer) {
            content += `
                <div class="bg-blue-50 p-4 rounded">
                    <h4 class="font-semibold mb-2">ข้อมูลผู้เช่า</h4>
                    <p>ชื่อ: ${customer.name}</p>
                    <p>อีเมล: ${customer.email}</p>
                    <p>โทรศัพท์: ${customer.phone}</p>
                    <p>วันเริ่มสัญญา: ${new Date(customer.contract_start).toLocaleDateString('th-TH')}</p>
                    <p>วันหมดสัญญา: ${new Date(customer.contract_end).toLocaleDateString('th-TH')}</p>
                </div>
            `;
        }
        
        content += `
                <div class="flex gap-2">
                    ${room.status === 'vacant' ? 
                        `<button onclick="addCustomer('${room.room_id}')" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            <i class="fas fa-user-plus mr-2"></i> เพิ่มผู้เช่า
                        </button>` : ''}
                    ${room.status === 'occupied' ? 
                        `<button onclick="viewInvoices('${room.room_id}')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            <i class="fas fa-file-invoice mr-2"></i> ดูใบแจ้งหนี้
                        </button>
                        <button onclick="checkOut('${room.room_id}')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            <i class="fas fa-sign-out-alt mr-2"></i> ย้ายออก
                        </button>` : ''}
                </div>
            </div>
        `;
        
        modalContent.innerHTML = content;
    }
    
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('roomModal').classList.add('hidden');
}

async function addCustomer(roomId) {
    const name = prompt('ชื่อผู้เช่า:');
    if (!name) return;
    
    const email = prompt('อีเมล:');
    if (!email) return;
    
    const phone = prompt('เบอร์โทรศัพท์:');
    if (!phone) return;
    
    const contractStart = prompt('วันเริ่มสัญญา (YYYY-MM-DD):');
    if (!contractStart) return;
    
    const contractEnd = prompt('วันหมดสัญญา (YYYY-MM-DD):');
    if (!contractEnd) return;
    
    try {
        const { data: customer, error: customerError } = await supabase
            .from('customers')
            .insert([{
                name,
                email,
                phone,
                room_id: roomId,
                contract_start: contractStart,
                contract_end: contractEnd
            }])
            .select()
            .single();
        
        if (customerError) throw customerError;
        
        const { error: roomError } = await supabase
            .from('rooms')
            .update({ 
                status: 'occupied',
                customer_id: customer.id
            })
            .eq('room_id', roomId);
        
        if (roomError) throw roomError;
        
        alert('เพิ่มผู้เช่าสำเร็จ!');
        closeModal();
        loadDashboardData();
        if (currentBuilding) {
            showBuilding(currentBuilding);
        }
    } catch (error) {
        console.error('Error adding customer:', error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
}

async function checkOut(roomId) {
    if (!confirm('ยืนยันการย้ายออก?')) return;
    
    try {
        const { error: roomError } = await supabase
            .from('rooms')
            .update({ 
                status: 'vacant',
                customer_id: null
            })
            .eq('room_id', roomId);
        
        if (roomError) throw roomError;
        
        const { error: customerError } = await supabase
            .from('customers')
            .delete()
            .eq('room_id', roomId);
        
        if (customerError) throw customerError;
        
        alert('ย้ายออกสำเร็จ!');
        closeModal();
        loadDashboardData();
        if (currentBuilding) {
            showBuilding(currentBuilding);
        }
    } catch (error) {
        console.error('Error checking out:', error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
}

async function viewInvoices(roomId) {
    try {
        const { data: invoices, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('room_id', roomId)
            .order('billing_month', { ascending: false });
        
        if (error) throw error;
        
        let invoiceList = '<h4 class="font-semibold mb-2">ประวัติใบแจ้งหนี้</h4>';
        
        if (invoices && invoices.length > 0) {
            invoiceList += '<div class="space-y-2">';
            invoices.forEach(invoice => {
                const monthYear = new Date(invoice.billing_month + '-01').toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long'
                });
                invoiceList += `
                    <div class="border p-2 rounded ${invoice.status === 'paid' ? 'bg-green-50' : 'bg-red-50'}">
                        <p>${monthYear} - ${invoice.total.toLocaleString()} บาท</p>
                        <p class="text-sm ${invoice.status === 'paid' ? 'text-green-600' : 'text-red-600'}">
                            ${invoice.status === 'paid' ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
                        </p>
                    </div>
                `;
            });
            invoiceList += '</div>';
        } else {
            invoiceList += '<p class="text-gray-500">ยังไม่มีใบแจ้งหนี้</p>';
        }
        
        document.getElementById('modalContent').innerHTML += invoiceList;
    } catch (error) {
        console.error('Error loading invoices:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadDashboardData();
});

window.showBuilding = showBuilding;
window.closeModal = closeModal;
window.addCustomer = addCustomer;
window.checkOut = checkOut;
window.viewInvoices = viewInvoices;