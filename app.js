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
  { route: 'Pondy → Chennai City drop', type: 'Prime Sedan', price: 'Rs. 3500/-', extras: 'Toll gate charges depend on route' },
  { route: 'Chennai Airport → Puducherry drop', type: 'Prime Sedan', price: 'Rs. 3000/-', extras: 'Toll gate charges extra price Rs. 200/-' },
  { route: 'Pondy → Chennai Airport drop', type: 'Prime SUV', price: 'Rs. 4500/-', extras: 'Toll gate charges extra price Rs. 200/-' },
  { route: 'Pondy → Chennai City drop', type: 'Prime SUV', price: 'Rs. 5000/-', extras: 'Toll gate charges depend on route' },
  { route: 'Chennai Airport → Puducherry drop', type: 'Prime SUV', price: 'Rs. 4500/-', extras: 'Toll gate charges extra price Rs. 200/-' }
];

function showToast(message, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.className = `toast ${type}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 2000);
}

function renderLocalTrips() {
  const tbody = document.getElementById('local-trip-body');
  if (!tbody) return;
  tbody.innerHTML = localTrips
    .map(
      r => `<tr>
        <td>${r.type}</td>
        <td>${r.slab}</td>
        <td>Rs. ${Number(r.price).toLocaleString('en-IN')}</td>
        <td>${r.extras || '-'}</td>
      </tr>`
    )
    .join('');
}

function renderTariffs() {
  const tbody = document.getElementById('tariff-body');
  if (!tbody) return;
  tbody.innerHTML = dayTariffs
    .map(
      r => `<tr>
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
      r => `<tr>
        <td>${r.route}</td>
        <td>${r.type}</td>
        <td>${r.price}</td>
        <td>${r.extras || '-'}</td>
      </tr>`
    )
    .join('');
}

function populateVehicleOptions() {
  const select = document.getElementById('vehicle-select');
  if (!select) return;
  select.innerHTML =
    '<option value="">Select vehicle</option>' +
    vehicles.map(v => `<option value="${v.name}">${v.name}</option>`).join('');
}

function bindBookingForm() {
  const form = document.getElementById('booking-form');
  const resetBtn = document.getElementById('booking-reset');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = {
      pickup: fd.get('pickup')?.trim(),
      drop: fd.get('drop')?.trim(),
      pickupDate: fd.get('pickupDate'),
      pickupTime: fd.get('pickupTime'),
      returnDate: fd.get('returnDate'),
      returnTime: fd.get('returnTime'),
      vehicle: fd.get('vehicle'),
      passengers: fd.get('passengers'),
      payment: fd.get('payment'),
      notes: fd.get('notes')?.trim()
    };

    if (!data.pickup || !data.drop || !data.pickupDate || !data.pickupTime || !data.vehicle || !data.passengers || !data.payment) {
      return showToast('Please fill all required fields', 'error');
    }

    form.reset();
    showToast('Booking submitted. We will confirm on call/WhatsApp.');
  });

  resetBtn?.addEventListener('click', () => form.reset());
}

function bindNavToggle() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!navToggle || !navMenu) return;
  
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
    // On mobile, show as flex column when visible
    if (!navMenu.classList.contains('hidden')) {
      navMenu.classList.add('flex', 'flex-col');
      navMenu.classList.remove('md:flex');
    } else {
      navMenu.classList.remove('flex', 'flex-col');
      navMenu.classList.add('md:flex');
    }
  });
  
  // Close menu when clicking a link on mobile
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        navMenu.classList.add('hidden');
        navMenu.classList.remove('flex', 'flex-col');
        navMenu.classList.add('md:flex');
      }
    });
  });
}

function init() {
  bindNavToggle();
  populateVehicleOptions();
  renderLocalTrips();
  renderTariffs();
  renderAirport();
  bindBookingForm();
}

document.addEventListener('DOMContentLoaded', init);

