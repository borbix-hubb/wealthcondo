let allRepairs = [];
let currentFilter = 'all';

async function loadRepairs() {
    try {
        const { data: repairs, error } = await supabase
            .from('repairs')
            .select(`
                *,
                rooms (room_id, building, floor),
                customers (name, phone)
            `)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        allRepairs = repairs || [];
        updateStats();
        displayRepairs(currentFilter);
    } catch (error) {
        console.error('Error loading repairs:', error);
    }
}

function updateStats() {
    const pending = allRepairs.filter(r => r.status === 'pending').length;
    const inProgress = allRepairs.filter(r => r.status === 'in_progress').length;
    const completed = allRepairs.filter(r => r.status === 'completed').length;
    const total = allRepairs.length;
    
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('inProgressCount').textContent = inProgress;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('totalCount').textContent = total;
}

function filterRepairs(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-blue-500');
        btn.classList.add('bg-gray-500');
    });
    
    event.target.classList.remove('bg-gray-500');
    event.target.classList.add('bg-blue-500');
    
    displayRepairs(filter);
}

function displayRepairs(filter) {
    const repairsList = document.getElementById('repairsList');
    
    let filteredRepairs = allRepairs;
    if (filter !== 'all') {
        filteredRepairs = allRepairs.filter(r => r.status === filter);
    }
    
    if (filteredRepairs.length === 0) {
        repairsList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-tools text-4xl mb-2"></i>
                <p>ไม่มีรายการแจ้งซ่อม</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    filteredRepairs.forEach(repair => {
        const statusColor = repair.status === 'completed' ? 'green' : 
                          repair.status === 'in_progress' ? 'yellow' : 'red';
        const statusText = repair.status === 'completed' ? 'เสร็จสิ้น' : 
                          repair.status === 'in_progress' ? 'กำลังซ่อม' : 'รอดำเนินการ';
        const statusIcon = repair.status === 'completed' ? 'check-circle' : 
                          repair.status === 'in_progress' ? 'wrench' : 'clock';
        
        html += `
            <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-bold">${repair.title}</h3>
                        <p class="text-gray-600 mt-1">${repair.description}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm bg-${statusColor}-100 text-${statusColor}-700 flex items-center">
                        <i class="fas fa-${statusIcon} mr-2"></i> ${statusText}
                    </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span class="text-gray-500">ห้อง:</span>
                        <span class="font-semibold ml-2">${repair.room_id}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">ผู้แจ้ง:</span>
                        <span class="font-semibold ml-2">${repair.customers?.name || '-'}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">โทร:</span>
                        <span class="font-semibold ml-2">${repair.customers?.phone || '-'}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">ตึก:</span>
                        <span class="font-semibold ml-2">${repair.rooms?.building || '-'} ชั้น ${repair.rooms?.floor || '-'}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">วันที่แจ้ง:</span>
                        <span class="font-semibold ml-2">${new Date(repair.created_at).toLocaleDateString('th-TH')}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">เวลา:</span>
                        <span class="font-semibold ml-2">${new Date(repair.created_at).toLocaleTimeString('th-TH')}</span>
                    </div>
                </div>
                
                ${repair.technician_notes ? `
                    <div class="mt-4 p-3 bg-blue-50 rounded">
                        <p class="text-sm"><strong>หมายเหตุ:</strong> ${repair.technician_notes}</p>
                    </div>
                ` : ''}
                
                ${repair.completed_at ? `
                    <div class="mt-2 text-sm text-gray-500">
                        <i class="fas fa-check-circle text-green-500 mr-1"></i>
                        เสร็จสิ้นเมื่อ: ${new Date(repair.completed_at).toLocaleDateString('th-TH')}
                    </div>
                ` : ''}
                
                <div class="mt-4 flex gap-2">
                    <button onclick="openUpdateModal('${repair.id}')" 
                        class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                        <i class="fas fa-edit mr-2"></i> อัปเดต
                    </button>
                    ${repair.status === 'pending' ? `
                        <button onclick="startRepair('${repair.id}')" 
                            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            <i class="fas fa-play mr-2"></i> เริ่มซ่อม
                        </button>
                    ` : ''}
                    ${repair.status === 'in_progress' ? `
                        <button onclick="completeRepair('${repair.id}')" 
                            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            <i class="fas fa-check mr-2"></i> เสร็จสิ้น
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    repairsList.innerHTML = html;
}

async function startRepair(repairId) {
    try {
        const { error } = await supabase
            .from('repairs')
            .update({ 
                status: 'in_progress',
                started_at: new Date().toISOString()
            })
            .eq('id', repairId);
        
        if (error) throw error;
        
        await loadRepairs();
    } catch (error) {
        console.error('Error starting repair:', error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
}

async function completeRepair(repairId) {
    if (!confirm('ยืนยันว่าซ่อมเสร็จสิ้นแล้ว?')) return;
    
    try {
        const { error } = await supabase
            .from('repairs')
            .update({ 
                status: 'completed',
                completed_at: new Date().toISOString()
            })
            .eq('id', repairId);
        
        if (error) throw error;
        
        await loadRepairs();
    } catch (error) {
        console.error('Error completing repair:', error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
}

function openUpdateModal(repairId) {
    const repair = allRepairs.find(r => r.id === repairId);
    if (!repair) return;
    
    document.getElementById('repairId').value = repairId;
    document.getElementById('repairStatus').value = repair.status;
    document.getElementById('technicianNotes').value = repair.technician_notes || '';
    
    document.getElementById('updateModal').classList.remove('hidden');
}

function closeUpdateModal() {
    document.getElementById('updateModal').classList.add('hidden');
    document.getElementById('updateForm').reset();
}

document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const repairId = document.getElementById('repairId').value;
    const status = document.getElementById('repairStatus').value;
    const notes = document.getElementById('technicianNotes').value;
    const imageFiles = document.getElementById('repairImage').files;
    
    try {
        const updateData = {
            status,
            technician_notes: notes
        };
        
        if (status === 'in_progress' && !allRepairs.find(r => r.id === repairId).started_at) {
            updateData.started_at = new Date().toISOString();
        }
        
        if (status === 'completed') {
            updateData.completed_at = new Date().toISOString();
        }
        
        const { error } = await supabase
            .from('repairs')
            .update(updateData)
            .eq('id', repairId);
        
        if (error) throw error;
        
        if (imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                const fileName = `repairs/${repairId}/${Date.now()}_${file.name}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('repair-images')
                    .upload(fileName, file);
                
                if (uploadError) {
                    console.error('Error uploading image:', uploadError);
                }
            }
        }
        
        alert('อัปเดตสำเร็จ!');
        closeUpdateModal();
        await loadRepairs();
    } catch (error) {
        console.error('Error updating repair:', error);
        alert('เกิดข้อผิดพลาด: ' + error.message);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    await loadRepairs();
});

window.filterRepairs = filterRepairs;
window.startRepair = startRepair;
window.completeRepair = completeRepair;
window.openUpdateModal = openUpdateModal;
window.closeUpdateModal = closeUpdateModal;