// ========== 管理員密碼 ==========
const ADMIN_PASSWORD = 'wedding2025';

// ========== 登入功能 ==========
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadDashboard();
    } else {
        document.getElementById('login-error').textContent = '密碼錯誤，請重試';
    }
});

// ========== 登出功能 ==========
function logout() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('password').value = '';
    document.getElementById('login-error').textContent = '';
}

// ========== 載入儀表板資料 ==========
function loadDashboard() {
    const rsvpList = JSON.parse(localStorage.getItem('rsvpList') || '[]');
    const wishList = JSON.parse(localStorage.getItem('wishList') || '[]');
    
    // 計算統計
    const attending = rsvpList.filter(r => r.attendance === 'yes');
    const notAttending = rsvpList.filter(r => r.attendance === 'no');
    const totalGuests = attending.reduce((sum, r) => sum + parseInt(r.guests || 0), 0);
    const totalVegetarian = attending.reduce((sum, r) => sum + parseInt(r.vegetarian || 0), 0);
    
    // 更新統計卡片
    document.getElementById('total-rsvp').textContent = rsvpList.length;
    document.getElementById('attending').textContent = attending.length;
    document.getElementById('total-guests').textContent = totalGuests;
    document.getElementById('vegetarian').textContent = totalVegetarian;
    document.getElementById('not-attending').textContent = notAttending.length;
    document.getElementById('total-wishes').textContent = wishList.length;
    
    // 載入 RSVP 表格
    loadRSVPTable(rsvpList);
    
    // 載入祝福表格
    loadWishesTable(wishList);
}

// ========== 載入 RSVP 表格 ==========
function loadRSVPTable(rsvpList) {
    const tbody = document.getElementById('rsvp-tbody');
    
    if (rsvpList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">目前沒有 RSVP 資料</td></tr>';
        return;
    }
    
    tbody.innerHTML = rsvpList.map(rsvp => `
        <tr>
            <td>${rsvp.name}</td>
            <td>${rsvp.phone}</td>
            <td>${rsvp.email || '-'}</td>
            <td>${rsvp.attendance === 'yes' ? '✅ 出席' : '❌ 不出席'}</td>
            <td>${rsvp.guests || '-'}</td>
            <td>${rsvp.vegetarian || '-'}</td>
            <td>${rsvp.message || '-'}</td>
            <td>${new Date(rsvp.timestamp).toLocaleString('zh-TW')}</td>
            <td><button class="btn btn-danger" onclick="deleteRSVP(${rsvp.id})" style="padding: 5px 10px; font-size: 0.8rem;">刪除</button></td>
        </tr>
    `).join('');
}

// ========== 載入祝福表格 ==========
function loadWishesTable(wishList) {
    const tbody = document.getElementById('wishes-tbody');
    
    if (wishList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">目前沒有祝福留言</td></tr>';
        return;
    }
    
    tbody.innerHTML = wishList.map(wish => `
        <tr>
            <td>${wish.name}</td>
            <td>${wish.message}</td>
            <td>${new Date(wish.timestamp).toLocaleString('zh-TW')}</td>
            <td><button class="btn btn-danger" onclick="deleteWish(${wish.id})" style="padding: 5px 10px; font-size: 0.8rem;">刪除</button></td>
        </tr>
    `).join('');
}

// ========== 刪除 RSVP ==========
function deleteRSVP(id) {
    if (!confirm('確定要刪除這筆 RSVP 資料嗎？')) return;
    
    let rsvpList = JSON.parse(localStorage.getItem('rsvpList') || '[]');
    rsvpList = rsvpList.filter(r => r.id !== id);
    localStorage.setItem('rsvpList', JSON.stringify(rsvpList));
    loadDashboard();
}

// ========== 刪除祝福 ==========
function deleteWish(id) {
    if (!confirm('確定要刪除這則祝福留言嗎？')) return;
    
    let wishList = JSON.parse(localStorage.getItem('wishList') || '[]');
    wishList = wishList.filter(w => w.id !== id);
    localStorage.setItem('wishList', JSON.stringify(wishList));
    loadDashboard();
}

// ========== 匯出 CSV ==========
function exportCSV() {
    const rsvpList = JSON.parse(localStorage.getItem('rsvpList') || '[]');
    
    if (rsvpList.length === 0) {
        alert('目前沒有資料可匯出');
        return;
    }
    
    const headers = ['姓名', '電話', 'Email', '是否出席', '出席人數', '素食人數', '留言', '回覆時間'];
    const rows = rsvpList.map(r => [
        r.name,
        r.phone,
        r.email || '',
        r.attendance === 'yes' ? '出席' : '不出席',
        r.guests || '',
        r.vegetarian || '',
        r.message || '',
        new Date(r.timestamp).toLocaleString('zh-TW')
    ]);
    
    const csvContent = '\uFEFF' + [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `RSVP_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// ========== 匯出 Excel ==========
function exportExcel() {
    const rsvpList = JSON.parse(localStorage.getItem('rsvpList') || '[]');
    
    if (rsvpList.length === 0) {
        alert('目前沒有資料可匯出');
        return;
    }
    
    let table = '<table border="1"><tr><th>姓名</th><th>電話</th><th>Email</th><th>是否出席</th><th>出席人數</th><th>素食人數</th><th>留言</th><th>回覆時間</th></tr>';
    
    rsvpList.forEach(r => {
        table += `<tr>
            <td>${r.name}</td>
            <td>${r.phone}</td>
            <td>${r.email || ''}</td>
            <td>${r.attendance === 'yes' ? '出席' : '不出席'}</td>
            <td>${r.guests || ''}</td>
            <td>${r.vegetarian || ''}</td>
            <td>${r.message || ''}</td>
            <td>${new Date(r.timestamp).toLocaleString('zh-TW')}</td>
        </tr>`;
    });
    
    table += '</table>';
    
    const blob = new Blob([`<html><head><meta charset="UTF-8"></head><body>${table}</body></html>`], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `RSVP_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
}

// ========== 清除所有資料 ==========
function clearAllData() {
    if (!confirm('⚠️ 確定要清除所有資料嗎？此操作無法復原！')) return;
    if (!confirm('再次確認：真的要刪除所有 RSVP 和祝福資料嗎？')) return;
    
    localStorage.removeItem('rsvpList');
    localStorage.removeItem('wishList');
    loadDashboard();
    alert('所有資料已清除');
}
