const vehicles = [
  { id: 'v1', name: 'Toyota Etios (Prime Sedan)', seats: 5, ac: true },
  { id: 'v2', name: 'Maruti Suzuki Dzire (Prime Sedan)', seats: 5, ac: true },
  { id: 'v3', name: 'Maruti Suzuki Ertiga (Prime SUV)', seats: 8, ac: true },
  { id: 'v4', name: 'Toyota Innova Crysta (Prime SUV)', seats: 8, ac: true },
  { id: 'v5', name: 'Toyota Innova (Prime SUV)', seats: 8, ac: true },
  { id: 'v6', name: 'Benze Tempo Traveller (12+1)', seats: 13, ac: true },
  { id: 'v7', name: 'Force Tempo Traveller (12+1)', seats: 13, ac: true }
];

const localTrips = [
  { type: 'Prime Sedan', slab: '30 km 3 hours', price: 1500, extras: 'Extra hr Rs.200 | Extra km Rs.12' },
  { type: 'Prime Sedan', slab: '50 km 5 hours', price: 2500, extras: 'Extra hr Rs.200 | Extra km Rs.12' },
  { type: 'Prime Sedan', slab: '80 km 8 hours', price: 3500, extras: 'Extra hr Rs.200 | Extra km Rs.12' },
  { type: 'Prime Sedan', slab: '100 km 10 hours', price: 4500, extras: 'Extra hr Rs.200 | Extra km Rs.12' },
  { type: 'Prime SUV', slab: '30 km 3 hours', price: 2500, extras: 'Extra hr Rs.400 | Extra km Rs.15' },
  { type: 'Prime SUV', slab: '50 km 5 hours', price: 3500, extras: 'Extra hr Rs.400 | Extra km Rs.15' },
  { type: 'Prime SUV', slab: '80 km 8 hours', price: 4500, extras: 'Extra hr Rs.400 | Extra km Rs.15' },
  { type: 'Prime SUV', slab: '100 km 10 hours', price: 6000, extras: 'Extra hr Rs.400 | Extra km Rs.15' }
];

const dayTariffs = [
  { type: 'Prime Sedan', tariff: 'Rs.2000/- Per day', perKm: 'Diesel Rs. 12/- (OR) above 300 km Rs. 14/-' },
  { type: 'Prime SUV', tariff: 'Rs.3000/- Per day', perKm: 'Diesel Rs. 15/- (OR) above 300 km Rs. 22/-' },
  { type: 'MUV Innova Crysta', tariff: 'Rs.3500/- Per day', perKm: 'Diesel Rs. 25/- (OR) above 300 km Rs. 30/-' }
];

const airportDrops = [
  { route: 'Pondy → Chennai Airport drop', type: 'Prime Sedan', price: 'Rs. 3000/-', extras: 'Toll gate charges extra price Rs. 200/-' },
  { route: 'Pondnthanksy → Chennai City drop', type: 'Prime Sedan', price: 'Rs. 3500/-', extras: 'Toll gate charges depend on route' },
  { route: 'Chennai Airport → Puducherry drop', type: 'Prime Sedan', price: 'Rs. 3000/-', extras: 'Toll gate charges extra price Rs. 200/-' },
  { route: 'Pondy → Chennai Airport drop', type: 'Prime SUV', price: 'Rs. 4500/-', extras: 'Toll gate charges extra price Rs. 200/-' },
  { route: 'Pondy → Chennai City drop', type: 'Prime SUV', price: 'Rs. 5000/-', extras: 'Toll gate charges depend on route' },
  { route: 'Chennai Airport → Puducherry drop', type: 'Prime SUV', price: 'Rs. 4500/-', extras: 'Toll gate charges extra price Rs. 200/-' }
];

const SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycbz2kldKpY3ALDU4ojvXQg1T23CnlXfqyDzGOQBQwjXfm-0zTBpLHTVX1qrtUWigVArn/exec";

// Toast message
function showToast(message, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.className = `toast ${type}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 2000);
}

// RENDER TABLES
function renderLocalTrips() {
  const tbody = document.getElementById('local-trip-body');
  if (!tbody) return;
  tbody.innerHTML = localTrips
    .map(
      r => `
<tr>
<td>${r.type}</td>
<td>${r.slab}</td>
<td>Rs. ${Number(r.price).toLocaleString('en-IN')}</td>
<td>${r.extras}</td>
</tr>`
    )
    .join('');
}

function renderTariffs() {
  const tbody = document.getElementById('tariff-body');
  if (!tbody) return;
  tbody.innerHTML = dayTariffs
    .map(
      r => `
<tr>
<td>${r.type}</td>
<td>${r.tariff}</td>
<td>${r.perKm}</td>
</tr>`
    )
    .join('');
}

function renderAirport() {
  const tbody = document.getElementById('airport-body');
  if (!tbody) return;
  tbody.innerHTML = airportDrops
    .map(
      r => `
<tr>
<td>${r.route}</td>
<td>${r.type}</td>
<td>${r.price}</td>
<td>${r.extras}</td>
</tr>`
    )
    .join('');
}

// Populate vehicles
function populateVehicleOptions() {
  const select = document.getElementById('vehicle-select');
  if (!select) return;
  select.innerHTML =
    '<option value="">Select vehicle</option>' +
    vehicles.map(v => `<option value="${v.name}">${v.name}</option>`).join('');
}

// BOOKING FORM
function bindBookingForm() {
  const form = document.getElementById('booking-form');
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const qrSection = document.getElementById('qr-section');
  const resetBtn = document.getElementById('booking-reset');

  paymentRadios.forEach(r => {
    r.addEventListener('change', () => {
      qrSection.classList.remove('hidden');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);

    const data = Object.fromEntries(fd.entries());

    const params = new URLSearchParams(data);

    fetch(SHEET_API_URL, {
      method: "POST",
      mode: "no-cors",
      body: params
    })
      .then(() => {
        showToast("Booking sent successfully");
      })
      .catch(() => showToast("Failed to send booking", "error"));
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    qrSection.classList.add('hidden');
  });
}

// NAVIGATION MENU
function bindNavToggle() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
  });
}

// FILTER FLEET
function filterFleet(e, type) {
  const cards = document.querySelectorAll('.fleet-card');
  const tabs = document.querySelectorAll('.fleet-tab');

  tabs.forEach(t => t.classList.remove('active'));
  e.target.classList.add('active');

  cards.forEach(card => {
    const match = type === 'all' || card.dataset.category === type;
    card.style.display = match ? 'block' : 'none';
  });
}

// GO TO BOOKING
function goToBooking(vehicleName) {
  const bookingSection = document.getElementById('booking');
  const vehicleSelect = document.getElementById('vehicle-select');
  vehicleSelect.value = vehicleName;

  bookingSection.scrollIntoView({ behavior: 'smooth' });
}

// INIT
function init() {
  bindNavToggle();
  populateVehicleOptions();
  renderLocalTrips();
  renderTariffs();
  renderAirport();
  bindBookingForm();
}

document.addEventListener('DOMContentLoaded', init);










