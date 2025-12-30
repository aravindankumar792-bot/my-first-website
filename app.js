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

const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzb2liqJFeg80sSAqPV2mFgwUQUe8ENxaUcgiabd-rQ9QLVT4V6KlfFSX7xh5KrsSo/exec";



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
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const qrSection = document.getElementById('qr-section');

  if (!form) return;

  // Show QR when payment selected
  if (qrSection) {
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        qrSection.classList.remove('hidden');
      });
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const fd = new FormData(form);

    const data = {
      name: fd.get('name')?.trim(),
      mobile: fd.get('mobile')?.trim(),
      email: fd.get('email')?.trim(),
      pickup: fd.get('pickup')?.trim(),
      drop: fd.get('drop')?.trim(),
      pickupDate: fd.get('pickupDate'),
      pickupTime: fd.get('pickupTime'),
      vehicle: fd.get('vehicle'),
      passengers: fd.get('passengers'),
      payment: fd.get('payment'),
      advance: fd.get('advance'),
      notes: fd.get('notes')?.trim()
    };

    if (
      !data.name ||
      !data.mobile ||
      !data.email ||
      !data.pickup ||
      !data.drop ||
      !data.pickupDate ||
      !data.pickupTime ||
      !data.vehicle ||
      !data.passengers ||
      !data.payment ||
      !data.advance
    ) {
      showToast('Please fill all required fields including advance payment', 'error');
      return;
    }

    const params = new URLSearchParams();
    Object.keys(data).forEach(k => params.append(k, data[k]));

    fetch(SHEET_API_URL, {
      method: "POST",
      mode: "cors",
      body: params
    })
    .then(res => res.text())
    .then(() => {
      const message =
        `🚕 *SB Travels & Transport Booking*\n\n` +
        `👤 Name: ${data.name}\n` +
        `📞 Mobile: ${data.mobile}\n` +
        `📧 Email: ${data.email}\n\n` +
        `📍 Pickup: ${data.pickup}\n` +
        `📍 Drop: ${data.drop}\n` +
        `🗓 Pickup: ${data.pickupDate} ${data.pickupTime}\n` +
        `🚗 Vehicle: ${data.vehicle}\n` +
        `👥 Passengers: ${data.passengers}\n` +
        `💰 Payment: ${data.payment}\n` +
        `💳 Advance Paid: ₹${data.advance}\n` +
        `📝 Notes: ${data.notes || 'None'}`;

      window.open(
        `https://wa.me/919629349482?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      form.reset();
      if (qrSection) qrSection.classList.add('hidden');
      showToast("Booking saved & WhatsApp opened");
    })
    .catch(() => showToast("Booking failed", "error"));
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    if (qrSection) qrSection.classList.add('hidden');
    showToast("Form cleared");
  });
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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fleet-card').forEach(card => {
    card.classList.add('show');
  });
});


  
function filterFleet(e, type) {
  const cards = document.querySelectorAll('.fleet-card');
  const tabs = document.querySelectorAll('.fleet-tab');

  tabs.forEach(t => t.classList.remove('active'));
  e.target.classList.add('active');

  cards.forEach(card => {
    const match = type === 'all' || card.dataset.category === type;

    if (match) {
      card.classList.remove('hide');
      card.classList.add('show');
    } else {
      card.classList.remove('show');
      card.classList.add('hide');
    }
  });
}
function goToBooking(vehicleName) {
  const bookingSection = document.getElementById('booking');
  const vehicleSelect = document.getElementById('vehicle-select');

  // 1. Auto select vehicle
  if (vehicleSelect && vehicleName) {
    vehicleSelect.value = vehicleName;
    vehicleSelect.dispatchEvent(new Event('change'));
  }

  // 2. Smooth scroll to booking section
  if (bookingSection) {
    bookingSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // 3. Small highlight animation
    bookingSection.classList.add('ring-4', 'ring-indigo-400');
    setTimeout(() => {
      bookingSection.classList.remove('ring-4', 'ring-indigo-400');
    }, 1200);
  }
}
let beachesExpanded = false;

function toggleBeaches() {
  const hiddenBeaches = document.querySelectorAll('.beach-item');

  hiddenBeaches.forEach((item, index) => {
    // First 3 always visible
    if (index >= 3) {
      if (beachesExpanded) {
        item.classList.add('hidden');   // HIDE
      } else {
        item.classList.remove('hidden'); // SHOW
      }
    }
  });

  const btn = document.getElementById('beachToggleBtn');
  btn.textContent = beachesExpanded ? "View More" : "View Less";

  beachesExpanded = !beachesExpanded;
}
const sectionState = {
  beach: false,
  auroville: false,
  temple: false,
  church: false
};

function toggleSection(section) {
  const items = document.querySelectorAll(`.${section}-item`);
  const btn = document.getElementById(`${section}ToggleBtn`);

  items.forEach((item, index) => {
    if (index >= 3) {
      if (sectionState[section]) {
        item.classList.add('hidden');   // VIEW LESS
      } else {
        item.classList.remove('hidden'); // VIEW MORE
      }
    }
  });

  btn.textContent = sectionState[section] ? "View More" : "View Less";
  sectionState[section] = !sectionState[section];
}
function toggleSection(type) {
  const items = document.querySelectorAll(`.${type}-item`);
  const btn = document.getElementById(`${type}ToggleBtn`);
  let hiddenFound = false;

  items.forEach(item => {
    if (item.classList.contains('hidden')) {
      item.classList.remove('hidden');
      hiddenFound = true;
    } else if (!hiddenFound) {
      item.classList.add('hidden');
    }
  });

  btn.textContent = hiddenFound ? "View Less" : "View More";
}









