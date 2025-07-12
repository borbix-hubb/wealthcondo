let currentCustomer = null;

async function loadCustomerData() {
    try {
        const user = await checkAuth();
        if (!user) return;
        
        const { data: customer, error: customerError } = await supabase
            .from('customers')
            .select('*')
            .eq('email', user.email)
            .single();
        
        if (customerError) throw customerError;
        
        currentCustomer = customer;
        
        displayCustomerInfo(customer);
        
        const { data: room, error: roomError } = await supabase
            .from('rooms')
            .select('*')
            .eq('room_id', customer.room_id)
            .single();
        
        if (roomError) throw roomError;
        
        displayRoomInfo(room);
        
        await loadInvoices(customer.id);
        await loadRepairs(customer.room_id);
    } catch (error) {
        console.error('Error loading customer data:', error);
    }
}

function displayCustomerInfo(customer) {
    const customerInfo = document.getElementById('customerInfo');
    customerInfo.innerHTML = `
        <p class="text-lg"><strong>ชื่อ:</strong> ${customer.name}</p>
        <p><strong>อีเมล:</strong> ${customer.email}</p>
        <p><strong>โทรศัพท์:</strong> ${customer.phone}</p>
        <p><strong>วันเริ่มสัญญา:</strong> ${new Date(customer.contract_start).toLocaleDateString('th-TH')}</p>
        <p><strong>วันหมดสัญญา:</strong> ${new Date(customer.contract_end).toLocaleDateString('th-TH')}</p>
    `;
}

function displayRoomInfo(room) {
    const roomInfo = document.getElementById('roomInfo');
    roomInfo.innerHTML = `
        <p class="text-lg"><strong>ห้อง:</strong> ${room.room_id}</p>
        <p><strong>ตึก:</strong> ${room.building}</p>
        <p><strong>ชั้น:</strong> ${room.floor}</p>
        <p><strong>สถานะ:</strong> <span class="text-green-600">กำลังเช่า</span></p>
    `;
}

async function loadInvoices(customerId) {
    try {
        const { data: invoices, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('customer_id', customerId)
            .order('billing_month', { ascending: false });
        
        if (error) throw error;
        
        const invoicesTable = document.getElementById('invoicesTable');
        
        if (!invoices || invoices.length === 0) {
            invoicesTable.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-8 text-gray-500">
                        ยังไม่มีใบแจ้งหนี้
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        invoices.forEach(invoice => {
            const monthYear = new Date(invoice.billing_month + '-01').toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long'
            });
            
            html += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4">${monthYear}</td>
                    <td class="py-3 px-4">${invoice.rent.toLocaleString()}</td>
                    <td class="py-3 px-4">${invoice.water_bill.toLocaleString()}</td>
                    <td class="py-3 px-4">${invoice.electric_bill.toLocaleString()}</td>
                    <td class="py-3 px-4">${invoice.parking_fee.toLocaleString()}</td>
                    <td class="py-3 px-4 font-bold">${invoice.total.toLocaleString()}</td>
                    <td class="py-3 px-4">
                        <span class="px-2 py-1 rounded text-sm ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                            ${invoice.status === 'paid' ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
                        </span>
                    </td>
                    <td class="py-3 px-4">
                        <button onclick="downloadInvoice('${invoice.invoice_id}')" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                            <i class="fas fa-download"></i> ดาวน์โหลด
                        </button>
                    </td>
                </tr>
            `;
        });
        
        invoicesTable.innerHTML = html;
    } catch (error) {
        console.error('Error loading invoices:', error);
    }
}

async function downloadInvoice(invoiceId) {
    try {
        const { data: invoice, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('invoice_id', invoiceId)
            .single();
        
        if (error) throw error;
        
        generateInvoicePDF(invoice);
    } catch (error) {
        console.error('Error downloading invoice:', error);
        alert('เกิดข้อผิดพลาดในการดาวน์โหลด');
    }
}

function generateInvoicePDF(invoice) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.addFont('https://cdn.jsdelivr.net/npm/@fontsource/sarabun@4.5.1/files/sarabun-thai-400-normal.woff', 'Sarabun', 'normal');
    doc.setFont('Sarabun');
    
    doc.setFontSize(20);
    doc.text('Wealth Condo', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('ใบแจ้งหนี้', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`เลขที่: ${invoice.invoice_id}`, 20, 50);
    doc.text(`ห้อง: ${invoice.room_id}`, 20, 60);
    doc.text(`เดือน: ${new Date(invoice.billing_month + '-01').toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}`, 20, 70);
    
    doc.line(20, 80, 190, 80);
    
    doc.text('รายการ', 30, 90);
    doc.text('จำนวนเงิน (บาท)', 150, 90);
    
    doc.text('ค่าเช่าห้อง', 30, 100);
    doc.text(invoice.rent.toLocaleString(), 150, 100);
    
    doc.text('ค่าน้ำ', 30, 110);
    doc.text(invoice.water_bill.toLocaleString(), 150, 110);
    
    doc.text('ค่าไฟ', 30, 120);
    doc.text(invoice.electric_bill.toLocaleString(), 150, 120);
    
    doc.text('ค่าจอดรถ', 30, 130);
    doc.text(invoice.parking_fee.toLocaleString(), 150, 130);
    
    doc.line(20, 140, 190, 140);
    
    doc.setFontSize(14);
    doc.text('รวมทั้งหมด', 30, 150);
    doc.text(invoice.total.toLocaleString() + ' บาท', 150, 150);
    
    doc.save(`invoice_${invoice.invoice_id}.pdf`);
}

async function loadRepairs(roomId) {
    try {
        const { data: repairs, error } = await supabase
            .from('repairs')
            .select('*')
            .eq('room_id', roomId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        displayRepairs(repairs);
    } catch (error) {
        console.error('Error loading repairs:', error);
    }
}

function displayRepairs(repairs) {
    const repairsSection = document.getElementById('repairsSection');
    
    if (!repairs || repairs.length === 0) {
        repairsSection.innerHTML = '<p class="text-gray-500">ยังไม่มีรายการแจ้งซ่อม</p>';
        return;
    }
    
    let html = '<div class="space-y-3 mt-4">';
    repairs.forEach(repair => {
        const statusColor = repair.status === 'completed' ? 'green' : 
                          repair.status === 'in_progress' ? 'yellow' : 'red';
        const statusText = repair.status === 'completed' ? 'เสร็จสิ้น' : 
                          repair.status === 'in_progress' ? 'กำลังดำเนินการ' : 'รอดำเนินการ';
        
        html += `
            <div class="border rounded p-3 bg-gray-50">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-semibold">${repair.title}</h4>
                        <p class="text-sm text-gray-600">${repair.description}</p>
                        <p class="text-xs text-gray-500 mt-1">
                            ${new Date(repair.created_at).toLocaleDateString('th-TH')}
                        </p>
                    </div>
                    <span class="px-2 py-1 rounded text-sm bg-${statusColor}-100 text-${statusColor}-700">
                        ${statusText}
                    </span>
                </div>
                ${repair.technician_notes ? `
                    <div class="mt-2 p-2 bg-blue-50 rounded">
                        <p class="text-sm"><strong>หมายเหตุจากช่าง:</strong> ${repair.technician_notes}</p>
                    </div>
                ` : ''}
            </div>
        `;
    });
    html += '</div>';
    
    repairsSection.innerHTML = html;
}

function showRepairForm() {
    document.getElementById('repairModal').classList.remove('hidden');
}

function closeRepairModal() {
    document.getElementById('repairModal').classList.add('hidden');
    document.getElementById('repairForm').reset();
}

document.getElementById('repairForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('repairTitle').value;
    const description = document.getElementById('repairDescription').value;
    
    try {
        const { error } = await supabase
            .from('repairs')
            .insert([{
                room_id: currentCustomer.room_id,
                customer_id: currentCustomer.id,
                title,
                description,
                status: 'pending'
            }]);
        
        if (error) throw error;
        
        alert('แจ้งซ่อมสำเร็จ!');
        closeRepairModal();
        await loadRepairs(currentCustomer.room_id);
    } catch (error) {
        console.error('Error creating repair request:', error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    await loadCustomerData();
});

window.downloadInvoice = downloadInvoice;
window.showRepairForm = showRepairForm;
window.closeRepairModal = closeRepairModal;