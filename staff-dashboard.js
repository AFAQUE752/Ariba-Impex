// Check authentication
function checkAuth() {
  const session = sessionStorage.getItem('staffSession') || localStorage.getItem('staffSession');
  if (!session) {
    window.location.href = 'staff-login.html';
    return null;
  }
  
  const loginData = JSON.parse(session);
  
  // Show/hide admin-only features based on role
  if (loginData.role !== 'admin') {
    // Hide admin-only buttons for regular staff
    const addStaffBtn = document.getElementById('add-staff-btn');
    if (addStaffBtn) addStaffBtn.style.display = 'none';
  }
  
  return loginData;
}

// Get time ago
function getTimeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Update dashboard
function updateDashboard() {
  const staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
  const onlineStaff = JSON.parse(localStorage.getItem('onlineStaff') || '[]');
  const totalStaff = staffList.length;
  const onlineCount = onlineStaff.length;
  const offlineCount = totalStaff - onlineCount;

  // Update stats
  document.getElementById('total-staff').textContent = totalStaff;
  document.getElementById('online-staff').textContent = onlineCount;
  document.getElementById('offline-staff').textContent = offlineCount;
  document.getElementById('active-sessions').textContent = onlineCount;

  // Update staff management table
  updateStaffManagementTable();

  // Update online staff list
  const onlineList = document.getElementById('online-staff-list');
  const noOnlineStaff = document.getElementById('no-online-staff');
  
  if (onlineCount === 0) {
    onlineList.innerHTML = '';
    noOnlineStaff.classList.remove('hidden');
  } else {
    noOnlineStaff.classList.add('hidden');
    onlineList.innerHTML = onlineStaff.map(staff => `
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              ${staff.name.charAt(0)}
            </div>
            <span class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-700 rounded-full pulse-dot"></span>
          </div>
          <div>
            <p class="font-semibold text-gray-800 dark:text-gray-200">${staff.name}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">${staff.position || 'Staff'}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm font-medium text-green-600 dark:text-green-400">Active</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">${getTimeAgo(staff.loginTime)}</p>
        </div>
      </div>
    `).join('');
  }

  // Update all staff list
  const allList = document.getElementById('all-staff-list');
  const noStaff = document.getElementById('no-staff');
  const onlineEmails = onlineStaff.map(s => s.email);
  
  // Check if current user is admin
  const currentSession = sessionStorage.getItem('staffSession') || localStorage.getItem('staffSession');
  const isAdmin = currentSession ? JSON.parse(currentSession).role === 'admin' : false;
  
  if (totalStaff === 0) {
    allList.innerHTML = '';
    noStaff.classList.remove('hidden');
  } else {
    noStaff.classList.add('hidden');
    allList.innerHTML = staffList.map(staff => {
      const isOnline = onlineEmails.includes(staff.email);
      return `
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all">
          <div class="flex items-center space-x-3 flex-1">
            <div class="relative">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                ${staff.name.charAt(0)}
              </div>
              <span class="absolute bottom-0 right-0 w-4 h-4 ${isOnline ? 'bg-green-500 pulse-dot' : 'bg-gray-400'} border-2 border-white dark:border-gray-700 rounded-full"></span>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-800 dark:text-gray-200">${staff.name}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">${staff.position}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500">${staff.email}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${isOnline ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'}">
              ${isOnline ? 'Online' : 'Offline'}
            </span>
            ${isAdmin ? `
              <button onclick="viewStaffPortal('${staff.email}')" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-2" title="View Portal Credentials">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
              <button onclick="editStaff('${staff.id}')" class="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 p-2" title="Edit">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button onclick="deleteStaff('${staff.id}', '${staff.name}')" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2" title="Delete">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }
}

// Update staff management table
function updateStaffManagementTable() {
  const staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
  const onlineStaff = JSON.parse(localStorage.getItem('onlineStaff') || '[]');
  const onlineEmails = onlineStaff.map(s => s.email);
  
  const tableBody = document.getElementById('staff-management-table');
  const noStaffManagement = document.getElementById('no-staff-management');
  
  if (staffList.length === 0) {
    tableBody.innerHTML = '';
    noStaffManagement.classList.remove('hidden');
  } else {
    noStaffManagement.classList.add('hidden');
    tableBody.innerHTML = staffList.map((staff, index) => {
      const isOnline = onlineEmails.includes(staff.email);
      return `
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="relative flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  ${staff.name.charAt(0)}
                </div>
                ${isOnline ? '<span class="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>' : ''}
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">${staff.name}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">ID: ${staff.id}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-gray-100">${staff.email}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-gray-100">${staff.position}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isOnline ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}">
              ${isOnline ? '● Online' : '○ Offline'}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex space-x-3">
              <button onclick="viewStaffCredentials('${staff.id}')" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="View Credentials">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
              </button>
              <button onclick="editStaffManagement('${staff.id}')" class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300" title="Edit">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button onclick="deleteStaffManagement('${staff.id}', '${staff.name}')" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
}

// Modal functions
const modal = document.getElementById('staff-modal');
const addStaffBtn = document.getElementById('add-staff-btn');
const addStaffManagementBtn = document.getElementById('add-staff-management-btn');
const closeModal = document.getElementById('close-modal');
const cancelModal = document.getElementById('cancel-modal');
const staffForm = document.getElementById('staff-form');

addStaffBtn.addEventListener('click', () => {
  document.getElementById('modal-title').textContent = 'Add Staff Member';
  staffForm.reset();
  document.getElementById('staff-id').value = '';
  modal.classList.add('active');
});

addStaffManagementBtn.addEventListener('click', () => {
  document.getElementById('modal-title').textContent = 'Add Staff Member';
  staffForm.reset();
  document.getElementById('staff-id').value = '';
  modal.classList.add('active');
});

closeModal.addEventListener('click', () => modal.classList.remove('active'));
cancelModal.addEventListener('click', () => modal.classList.remove('active'));

// Add/Edit staff
staffForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const id = document.getElementById('staff-id').value || Date.now().toString();
  const name = document.getElementById('staff-name').value.trim();
  const email = document.getElementById('staff-email').value.trim().toLowerCase();
  const position = document.getElementById('staff-position').value.trim();
  const password = document.getElementById('staff-password').value;

  if (password.length < 6) {
    alert('Password must be at least 6 characters long');
    return;
  }

  let staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
  
  // Check for duplicate email (excluding current staff if editing)
  const duplicate = staffList.find(s => s.email === email && s.id !== id);
  if (duplicate) {
    alert('A staff member with this email already exists');
    return;
  }

  const staffIndex = staffList.findIndex(s => s.id === id);
  const staffData = { id, name, email, position, password };

  if (staffIndex !== -1) {
    staffList[staffIndex] = staffData;
  } else {
    staffList.push(staffData);
  }

  localStorage.setItem('staffList', JSON.stringify(staffList));
  modal.classList.remove('active');
  updateDashboard();
  alert(`Staff member ${staffIndex !== -1 ? 'updated' : 'added'} successfully!`);
});

// Edit staff
window.editStaff = (id) => {
  const staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
  const staff = staffList.find(s => s.id === id);
  
  if (staff) {
    document.getElementById('modal-title').textContent = 'Edit Staff Member';
    document.getElementById('staff-id').value = staff.id;
    document.getElementById('staff-name').value = staff.name;
    document.getElementById('staff-email').value = staff.email;
    document.getElementById('staff-position').value = staff.position;
    document.getElementById('staff-password').value = staff.password;
    modal.classList.add('active');
  }
};

// Edit staff from management table
window.editStaffManagement = (id) => {
  window.editStaff(id);
};

// Delete staff
window.deleteStaff = (id, name) => {
  if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
    let staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
    const staff = staffList.find(s => s.id === id);
    staffList = staffList.filter(s => s.id !== id);
    localStorage.setItem('staffList', JSON.stringify(staffList));
    
    // Also remove from online list if logged in
    if (staff) {
      let onlineStaff = JSON.parse(localStorage.getItem('onlineStaff') || '[]');
      onlineStaff = onlineStaff.filter(s => s.email !== staff.email);
      localStorage.setItem('onlineStaff', JSON.stringify(onlineStaff));
    }
    
    updateDashboard();
    alert('Staff member deleted successfully');
  }
};

// Delete staff from management table
window.deleteStaffManagement = (id, name) => {
  window.deleteStaff(id, name);
};

// View staff credentials
window.viewStaffCredentials = (id) => {
  const staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
  const staff = staffList.find(s => s.id === id);
  if (staff) {
    alert(`Staff Login Credentials:\n\n━━━━━━━━━━━━━━━━━━━━━━━━\n\n👤 Name: ${staff.name}\n📧 Email: ${staff.email}\n🔐 Password: ${staff.password}\n💼 Position: ${staff.position}\n\n━━━━━━━━━━━━━━━━━━━━━━━━\n\nShare these credentials securely with ${staff.name} to access the staff portal.`);
  }
};

// View staff portal credentials
window.viewStaffPortal = (email) => {
  const staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
  const staff = staffList.find(s => s.email === email);
  if (staff) {
    alert(`Staff Portal Login Credentials:\n\nEmail: ${staff.email}\nPassword: ${staff.password}\n\nShare these credentials with ${staff.name} to access the staff portal.`);
  }
};

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  const session = sessionStorage.getItem('staffSession') || localStorage.getItem('staffSession');
  if (session) {
    const loginData = JSON.parse(session);
    let onlineStaff = JSON.parse(localStorage.getItem('onlineStaff') || '[]');
    onlineStaff = onlineStaff.filter(staff => staff.email !== loginData.email);
    localStorage.setItem('onlineStaff', JSON.stringify(onlineStaff));
  }
  
  sessionStorage.removeItem('staffSession');
  localStorage.removeItem('staffSession');
  window.location.href = 'staff-login.html';
});

// Refresh
document.getElementById('refresh-btn').addEventListener('click', () => {
  updateDashboard();
  const btn = document.getElementById('refresh-btn');
  btn.querySelector('svg').style.animation = 'spin 1s linear';
  setTimeout(() => {
    btn.querySelector('svg').style.animation = '';
  }, 1000);
});

// Clear sessions
document.getElementById('clear-sessions-btn').addEventListener('click', () => {
  if (confirm('Clear all active sessions? This will log out all staff members.')) {
    localStorage.setItem('onlineStaff', JSON.stringify([]));
    updateDashboard();
    alert('All sessions cleared successfully!');
  }
});

// Export data
document.getElementById('export-data-btn').addEventListener('click', () => {
  const staffList = JSON.parse(localStorage.getItem('staffList') || '[]');
  const onlineStaff = JSON.parse(localStorage.getItem('onlineStaff') || '[]');
  const data = {
    exportDate: new Date().toISOString(),
    totalStaff: staffList.length,
    onlineStaff: onlineStaff.length,
    staff: staffList.map(s => ({ name: s.name, email: s.email, position: s.position })),
    currentlyOnline: onlineStaff
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `staff-data-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
});

// Initialize
const loginData = checkAuth();
if (loginData) {
  // Show staff management section only for admin
  if (loginData.role === 'admin') {
    document.getElementById('staff-management-section').style.display = 'block';
  }
  
  updateDashboard();
  setInterval(updateDashboard, 30000); // Auto-refresh every 30 seconds
}

// Dark mode
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}
