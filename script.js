let selectedSeats = []; // ที่นั่งที่เลือก
let currentMovie = '';  // ชื่อภาพยนตร์ที่เลือก
let selectedTime = null;
let
// ฟังก์ชันการเลือกภาพยนตร์
function selectMovie(movieName) {
  currentMovie = movieName; // ตั้งค่าชื่อภาพยนตร์ที่เลือก
  selectedSeats = []; // รีเซ็ตที่นั่งที่เลือก
  localStorage.setItem('moviePoster', posterUrl);
  document.getElementById('movie-poster').src = posterUrl;
  document.getElementById('movie-name').innerText = `คุณเลือกภาพยนตร์: ${movieName}`;
  displaySeats(movieName); // แสดงที่นั่งสำหรับภาพยนตร์ที่เลือก
  document.getElementById('seat-selection').style.display = 'block';
}
// การเก็บข้อมูล (เช่น ชื่อผู้ใช้และอีเมล์)
localStorage.setItem('username', 'user123');
localStorage.setItem('email', 'user123@example.com');

// การดึงข้อมูล
const username = localStorage.getItem('username');
const email = localStorage.getItem('email');

// การลบข้อมูล
localStorage.removeItem('username');
localStorage.removeItem('email');



// ฟังก์ชันสำหรับการลงทะเบียน
function registerUser(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'success') {
        alert('Registration successful');
        showLogin();
      } else {
        alert('Registration failed: ' + data.message);
      }
    })
    .catch((error) => console.error('Error:', error));
}

function showRegister() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
}

function showLogin() {
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
}



















window.onload = function() {
  // ดึงข้อมูลจาก localStorage
  let selectedMovie = localStorage.getItem('selectedMovie');
  let moviePoster = localStorage.getItem('moviePoster');
  
  // ตรวจสอบข้อมูลที่ดึงมา
  console.log('Selected Movie from localStorage:', selectedMovie);
  console.log('Poster URL from localStorage:', moviePoster);
  
  // แสดงข้อมูลภาพยนตร์หากมีการเลือก
  if (selectedMovie && moviePoster) {
    document.getElementById('movie-poster').src = moviePoster;
  }
}

function goBackToMovieSelection() {
    // แสดงหน้าเลือกหนังและซ่อนหน้าอื่น
    document.getElementById('movie-selection').style.display = 'block';
    document.getElementById('confirmation').style.display = 'none';
    // สามารถเพิ่มการจัดการหน้าอื่น ๆ ที่ต้องการแสดงผล
  }


// ฟังก์ชันการเลือกเวลา
function selectTime(time) {
  selectedTime = time;
  document.getElementById('selected-time').innerText = `คุณเลือกเวลา: ${time}`;
}

// ฟังก์ชันการเลือกที่นั่ง
function selectSeat(seat) {
  const seats = loadSeatData(currentMovie); // โหลดข้อมูลที่นั่งของภาพยนตร์ปัจจุบัน
  const seatIndex = parseInt(seat.innerText.substring(1)) - 1; // ดึง index ของที่นั่ง (เช่น A1 => index 0)

  if (seats[seatIndex]) {
    // ถ้าที่นั่งถูกจองแล้ว ไม่ให้เลือก
    alert('ที่นั่งนี้ถูกจองไปแล้ว');
    return;
  }

  // ถ้าที่นั่งถูกเลือกแล้ว ให้ยกเลิกการเลือก
  if (seat.classList.contains('selected')) {
    seat.classList.remove('selected');
    seats[seatIndex] = false; // อัปเดตข้อมูลที่นั่งใน LocalStorage
  } else {
    seat.classList.add('selected');
    seats[seatIndex] = true; // อัปเดตข้อมูลที่นั่งใน LocalStorage
  }

  saveSeatData(currentMovie, seats); // บันทึกข้อมูลที่นั่งตามชื่อภาพยนตร์ใน LocalStorage
}

// ฟังก์ชันยืนยันการจอง
function confirmBooking() {
  if (!selectedTime) {
    alert('กรุณาเลือกเวลาก่อนยืนยันการจอง');
    return;
  }

  const seats = loadSeatData(currentMovie);
  const selectedSeatsList = seats
      .map((isBooked, index) => (isBooked ? `A${index + 1}` : null))
      .filter(seat => seat !== null)
      .join(', ');

  if (selectedSeatsList.length === 0) {
    alert('กรุณาเลือกที่นั่งก่อนยืนยันการจอง');
    return;
  }

  // แสดงข้อมูลการจอง
  document.getElementById('ticket-movie').innerText = currentMovie;
  document.getElementById('ticket-time').innerText = selectedTime;
  document.getElementById('ticket-seats').innerText = selectedSeatsList;

  // แสดงหน้าตั๋ว
  document.getElementById('seat-selection').style.display = 'none';
  document.getElementById('confirmation').style.display = 'block';
}

// ฟังก์ชันแสดงที่นั่งตามชื่อภาพยนตร์
function displaySeats(movieName) {
  const seatContainer = document.getElementById('seat-container');
  seatContainer.innerHTML = ''; // ลบที่นั่งเก่าออก

  const seats = loadSeatData(movieName); // ดึงข้อมูลที่นั่งของภาพยนตร์จาก LocalStorage

  seats.forEach((isBooked, index) => {
    const seatButton = document.createElement('button');
    seatButton.className = 'seat';
    seatButton.innerText = `A${index + 1}`;
    seatButton.style.backgroundColor = isBooked ? 'green' : '#000000'; // ถ้าที่นั่งถูกจองให้เป็นสีเขียว

    // เมื่อกดเลือกที่นั่ง
    seatButton.onclick = function () {
      selectSeat(seatButton); // ใช้ฟังก์ชัน selectSeat ที่แก้ไขใหม่
    };

    seatContainer.appendChild(seatButton);
  });
}

// ฟังก์ชันบันทึกข้อมูลที่นั่งตามชื่อภาพยนตร์
function saveSeatData(movieName, seats) {
  localStorage.setItem(`seatData_${movieName}`, JSON.stringify(seats));
}

// ฟังก์ชันดึงข้อมูลที่นั่งตามชื่อภาพยนตร์
function loadSeatData(movieName) {
  return JSON.parse(localStorage.getItem(`seatData_${movieName}`)) || Array(20).fill(false); // หากไม่มีข้อมูลใน LocalStorage ให้ค่าเริ่มต้นเป็นที่นั่งทั้งหมดที่ไม่ได้จอง
}


document.getElementById('confirmation').style.display = 'flex';









// ฟังก์ชันแก้ไขโปรไฟล์
function editProfile() {
  alert('Edit Profile function will be implemented.');
}

// ฟังก์ชันเปลี่ยนรหัสผ่าน
function changePassword() {
  alert('Change Password function will be implemented.');
}

// ฟังก์ชันออกจากระบบ
function logout() {
  // คุณสามารถเพิ่มฟังก์ชันการออกจากระบบเช่นการลบ session หรือ redirect ไปหน้า login
  alert('Logging out...');
  window.location.href = 'login.html'; // หรือหน้า login ของคุณ
}




document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;

  fetch('/register', {  // ส่งข้อมูลไปยังเซิร์ฟเวอร์
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
      headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
});
