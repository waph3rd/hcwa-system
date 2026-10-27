const API_URL = 'http://localhost:5000/api/auth';

// --- AUTHENTICATION LOGIC ---

function toggleAuth(type) {
  const loginForm = document.getElementById('loginForm');
  const regForm = document.getElementById('registerForm');
  const msg = document.getElementById('authMessage');
  msg.innerText = '';

  if (type === 'register') {
    loginForm.style.display = 'none';
    regForm.style.display = 'flex';
  } else {
    loginForm.style.display = 'flex';
    regForm.style.display = 'none';
  }
}

// Handle Registration Submit
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const shareCapital = document.getElementById('regCapital').value;

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, shareCapital })
      });
      const data = await res.json();

      if (res.ok) {
        document.getElementById('authMessage').style.color = 'green';
        document.getElementById('authMessage').innerText = 'Registered! Redirecting to login...';
        setTimeout(() => toggleAuth('login'), 1500);
      } else {
        document.getElementById('authMessage').style.color = 'red';
        document.getElementById('authMessage').innerText = data.message;
      }
    } catch (err) {
      document.getElementById('authMessage').style.color = 'red';
      document.getElementById('authMessage').innerText = 'Server Error. Try again.';
    }
  });
}

// Handle Login Submit
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        // Save token and user details to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to Dashboard
        window.location.href = 'index.html';
      } else {
        document.getElementById('authMessage').style.color = 'red';
        document.getElementById('authMessage').innerText = data.message;
      }
    } catch (err) {
      document.getElementById('authMessage').style.color = 'red';
      document.getElementById('authMessage').innerText = 'Server connection failed.';
    }
  });
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Protect Dashboard & Load User Info
if (window.location.pathname.includes('index.html')) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    window.location.href = 'login.html';
  } else {
    document.getElementById('userNameDisplay').innerText = user.name;
  }
}

// --- DASHBOARD & MODAL LOGIC ---

function openModal(modalId) {
  document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function selectMember(memberName) {
  closeModal('memberListModal');
  document.getElementById('selectedMemberName').innerText = memberName;
  openModal('memberActionModal');
}

// Chart Render Strategy on Dashboard Load
if (document.getElementById('fundsChart')) {
  window.onload = function() {
    const ctxFunds = document.getElementById('fundsChart').getContext('2d');
    new Chart(ctxFunds, {
      type: 'bar',
      data: {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        datasets: [{ label: 'Funds Growth', data: [60000, 70000, 100000, 120000, 150000], backgroundColor: '#6c6c6c' }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    const ctxContribution = document.getElementById('contributionChart').getContext('2d');
    new Chart(ctxContribution, {
      type: 'line',
      data: {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        datasets: [{ label: 'Contributions', data: [10, 20, 30, 32, 40], borderColor: '#333', fill: false }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
  };
}