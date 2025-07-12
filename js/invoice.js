let selectedRoom = null;
let selectedCustomer = null;

async function loadRooms() {
    try {
        const { data: rooms, error } = await supabase
            .from('rooms')
            .select(`
                *,
                customers (*)
            `)
            .eq('status', 'occupied')
            .order('room_id');
        
        if (error) throw error;
        
        const roomSelect = document.getElementById('roomSelect');
        roomSelect.innerHTML = '<option value="">-- เลือกห้อง --</option>';
        
        rooms.forEach(room => {
            if (room.customers && room.customers.length > 0) {
                const option = document.createElement('option');
                option.value = room.room_id;
                option.textContent = `${room.room_id} - ${room.customers[0].name}`;
                option.dataset.customer = JSON.stringify(room.customers[0]);
                roomSelect.appendChild(option);
            }
        });
        
        roomSelect.addEventListener('change', (e) => {
            const selected = e.target.selectedOptions[0];
            if (selected && selected.value) {
                selectedRoom = selected.value;
                selectedCustomer = JSON.parse(selected.dataset.customer);
                displayCustomerInfo();
                loadRoomRent();
            } else {
                selectedRoom = null;
                selectedCustomer = null;
                document.getElementById('customerInfo').classList.add('hidden');
            }
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

function displayCustomerInfo() {
    const customerDetails = document.getElementById('customerDetails');
    customerDetails.innerHTML = `
        <p><strong>ชื่อ:</strong> ${selectedCustomer.name}</p>
        <p><strong>อีเมล:</strong> ${selectedCustomer.email}</p>
        <p><strong>โทรศัพท์:</strong> ${selectedCustomer.phone}</p>
    `;
    document.getElementById('customerInfo').classList.remove('hidden');
}

async function loadRoomRent() {
    try {
        const { data: lastInvoice, error } = await supabase
            .from('invoices')
            .select('rent')
            .eq('room_id', selectedRoom)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (!error && lastInvoice) {
            document.getElementById('rent').value = lastInvoice.rent;
        } else {
            document.getElementById('rent').value = 5000;
        }
    } catch (error) {
        document.getElementById('rent').value = 5000;
    }
}

function calculateWaterBill() {
    const previous = parseFloat(document.getElementById('waterPrevious').value) || 0;
    const current = parseFloat(document.getElementById('waterCurrent').value) || 0;
    const rate = parseFloat(document.getElementById('waterRate').value) || 18;
    
    const units = Math.max(0, current - previous);
    const total = units * rate;
    
    document.getElementById('waterUnits').textContent = units;
    document.getElementById('waterTotal').textContent = total.toLocaleString();
    
    calculateTotal();
}

function calculateElectricBill() {
    const previous = parseFloat(document.getElementById('electricPrevious').value) || 0;
    const current = parseFloat(document.getElementById('electricCurrent').value) || 0;
    const rate = parseFloat(document.getElementById('electricRate').value) || 8;
    
    const units = Math.max(0, current - previous);
    const total = units * rate;
    
    document.getElementById('electricUnits').textContent = units;
    document.getElementById('electricTotal').textContent = total.toLocaleString();
    
    calculateTotal();
}

function calculateTotal() {
    const rent = parseFloat(document.getElementById('rent').value) || 0;
    const parking = parseFloat(document.getElementById('parkingFee').value) || 0;
    const water = parseFloat(document.getElementById('waterTotal').textContent.replace(/,/g, '')) || 0;
    const electric = parseFloat(document.getElementById('electricTotal').textContent.replace(/,/g, '')) || 0;
    
    const grandTotal = rent + parking + water + electric;
    document.getElementById('grandTotal').textContent = grandTotal.toLocaleString();
}

async function generateInvoice(invoiceData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Wealth Condo', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('ใบแจ้งหนี้ / Invoice', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`เลขที่: ${invoiceData.invoice_id}`, 20, 50);
    doc.text(`วันที่: ${new Date().toLocaleDateString('th-TH')}`, 150, 50);
    
    doc.text(`ห้อง: ${invoiceData.room_id}`, 20, 60);
    doc.text(`ผู้เช่า: ${selectedCustomer.name}`, 20, 70);
    doc.text(`เดือน: ${new Date(invoiceData.billing_month + '-01').toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}`, 20, 80);
    
    doc.line(20, 90, 190, 90);
    
    doc.text('รายการ', 30, 100);
    doc.text('จำนวนเงิน (บาท)', 150, 100);
    
    let y = 110;
    doc.text('ค่าเช่าห้อง', 30, y);
    doc.text(invoiceData.rent.toLocaleString(), 150, y);
    
    y += 10;
    doc.text('ค่าน้ำ', 30, y);
    doc.text(invoiceData.water_bill.toLocaleString(), 150, y);
    
    y += 10;
    doc.text('ค่าไฟ', 30, y);
    doc.text(invoiceData.electric_bill.toLocaleString(), 150, y);
    
    if (invoiceData.parking_fee > 0) {
        y += 10;
        doc.text('ค่าจอดรถ', 30, y);
        doc.text(invoiceData.parking_fee.toLocaleString(), 150, y);
    }
    
    y += 15;
    doc.line(20, y, 190, y);
    
    y += 10;
    doc.setFontSize(14);
    doc.text('รวมทั้งหมด', 30, y);
    doc.text(invoiceData.total.toLocaleString() + ' บาท', 150, y);
    
    y += 20;
    doc.setFontSize(10);
    doc.text('หมายเหตุ: กรุณาชำระภายในวันที่ 5 ของทุกเดือน', 20, y);
    
    return doc;
}

async function saveInvoice(invoiceData) {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .insert([invoiceData])
            .select()
            .single();
        
        if (error) throw error;
        
        const doc = await generateInvoice(data);
        const pdfBlob = doc.output('blob');
        
        const fileName = `invoices/${data.invoice_id}.pdf`;
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, pdfBlob);
        
        if (uploadError) {
            console.error('Error uploading PDF:', uploadError);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(fileName);
            
            await supabase
                .from('invoices')
                .update({ pdf_url: publicUrl })
                .eq('invoice_id', data.invoice_id);
        }
        
        return data;
    } catch (error) {
        console.error('Error saving invoice:', error);
        throw error;
    }
}

async function previewInvoice() {
    if (!validateForm()) return;
    
    const invoiceData = collectInvoiceData();
    const doc = await generateInvoice(invoiceData);
    
    window.open(doc.output('bloburl'), '_blank');
}

function validateForm() {
    if (!selectedRoom) {
        alert('กรุณาเลือกห้อง');
        return false;
    }
    
    const billingMonth = document.getElementById('billingMonth').value;
    if (!billingMonth) {
        alert('กรุณาเลือกเดือนที่เรียกเก็บ');
        return false;
    }
    
    const rent = document.getElementById('rent').value;
    if (!rent || rent <= 0) {
        alert('กรุณากรอกค่าเช่าห้อง');
        return false;
    }
    
    return true;
}

function collectInvoiceData() {
    const waterBill = parseFloat(document.getElementById('waterTotal').textContent.replace(/,/g, '')) || 0;
    const electricBill = parseFloat(document.getElementById('electricTotal').textContent.replace(/,/g, '')) || 0;
    
    return {
        invoice_id: `INV-${Date.now()}`,
        room_id: selectedRoom,
        customer_id: selectedCustomer.id,
        billing_month: document.getElementById('billingMonth').value,
        rent: parseFloat(document.getElementById('rent').value) || 0,
        water_bill: waterBill,
        electric_bill: electricBill,
        parking_fee: parseFloat(document.getElementById('parkingFee').value) || 0,
        total: parseFloat(document.getElementById('grandTotal').textContent.replace(/,/g, '')) || 0,
        status: 'unpaid',
        created_at: new Date().toISOString()
    };
}

async function loadRecentInvoices() {
    try {
        const { data: invoices, error } = await supabase
            .from('invoices')
            .select(`
                *,
                customers (name)
            `)
            .order('created_at', { ascending: false })
            .limit(10);
        
        if (error) throw error;
        
        const tbody = document.getElementById('recentInvoices');
        
        if (!invoices || invoices.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-8 text-gray-500">
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
                month: 'short'
            });
            
            html += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4">${invoice.invoice_id}</td>
                    <td class="py-3 px-4">${invoice.room_id}</td>
                    <td class="py-3 px-4">${invoice.customers?.name || '-'}</td>
                    <td class="py-3 px-4">${monthYear}</td>
                    <td class="py-3 px-4">${invoice.total.toLocaleString()}</td>
                    <td class="py-3 px-4">
                        <span class="px-2 py-1 rounded text-sm ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                            ${invoice.status === 'paid' ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
                        </span>
                    </td>
                    <td class="py-3 px-4">
                        <button onclick="markAsPaid('${invoice.invoice_id}')" 
                            class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 ${invoice.status === 'paid' ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${invoice.status === 'paid' ? 'disabled' : ''}>
                            <i class="fas fa-check"></i>
                        </button>
                        <button onclick="viewInvoice('${invoice.invoice_id}')" 
                            class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 ml-1">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    } catch (error) {
        console.error('Error loading recent invoices:', error);
    }
}

async function markAsPaid(invoiceId) {
    if (!confirm('ยืนยันการชำระเงิน?')) return;
    
    try {
        const { error } = await supabase
            .from('invoices')
            .update({ status: 'paid' })
            .eq('invoice_id', invoiceId);
        
        if (error) throw error;
        
        await loadRecentInvoices();
    } catch (error) {
        console.error('Error marking as paid:', error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
}

async function viewInvoice(invoiceId) {
    try {
        const { data: invoice, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('invoice_id', invoiceId)
            .single();
        
        if (error) throw error;
        
        const doc = await generateInvoice(invoice);
        window.open(doc.output('bloburl'), '_blank');
    } catch (error) {
        console.error('Error viewing invoice:', error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadRooms();
    await loadRecentInvoices();
    
    document.getElementById('billingMonth').value = new Date().toISOString().slice(0, 7);
    
    document.getElementById('waterPrevious').addEventListener('input', calculateWaterBill);
    document.getElementById('waterCurrent').addEventListener('input', calculateWaterBill);
    document.getElementById('waterRate').addEventListener('input', calculateWaterBill);
    
    document.getElementById('electricPrevious').addEventListener('input', calculateElectricBill);
    document.getElementById('electricCurrent').addEventListener('input', calculateElectricBill);
    document.getElementById('electricRate').addEventListener('input', calculateElectricBill);
    
    document.getElementById('rent').addEventListener('input', calculateTotal);
    document.getElementById('parkingFee').addEventListener('input', calculateTotal);
    
    document.getElementById('invoiceForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            const invoiceData = collectInvoiceData();
            await saveInvoice(invoiceData);
            
            alert('บันทึกใบแจ้งหนี้สำเร็จ!');
            document.getElementById('invoiceForm').reset();
            document.getElementById('customerInfo').classList.add('hidden');
            selectedRoom = null;
            selectedCustomer = null;
            
            document.getElementById('waterUnits').textContent = '0';
            document.getElementById('waterTotal').textContent = '0';
            document.getElementById('electricUnits').textContent = '0';
            document.getElementById('electricTotal').textContent = '0';
            document.getElementById('grandTotal').textContent = '0';
            
            await loadRecentInvoices();
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
        }
    });
});

window.previewInvoice = previewInvoice;
window.markAsPaid = markAsPaid;
window.viewInvoice = viewInvoice;