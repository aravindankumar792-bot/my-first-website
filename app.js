const vehicles = [
  { id: 'v1', name: 'Toyota Etios (Prime Sedan)', seats: 5, ac: true },
  { id: 'v2', name: 'Maruti Suzuki Dzire (Prime Sedan)', seats: 5, ac: true },
  { id: 'v3', name: 'Maruti Suzuki Ertiga (Prime SUV)', seats: 7, ac: true },
  { id: 'v4', name: 'Toyota Innova Crysta (Prime SUV)', seats: 7, ac: true },
  { id: 'v5', name: 'Toyota Innova (Prime SUV)', seats: 7, ac: true },
  { id: 'v6', name: 'Benze Tempo Traveller (11+1)', seats: 12, ac: true },
  { id: 'v7', name: 'Force Tempo Traveller (11+1)', seats: 12, ac: true },
  { id: 'v8', name: 'Bus (54+1)', seats: 55, ac: true }
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

const SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycbz0OllDm0ZJkC-bQkvFtgYBO48tOJAJLxL5XF1Z4iMWUFATqA_4scI-UIrH96TpBi9i/exec";

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
      .then(() => {

  const message =
    `SB Travels & Transport Booking\n\n` +
    `Name: ${data.name}\n` +
    `Mobile: ${data.mobile}\n` +
    `Email: ${data.email}\n` +
    `Pickup: ${data.pickup}\n` +
    `Drop: ${data.drop}\n` +
    `Date & Time: ${data.pickupDate} ${data.pickupTime}\n` +
    `Vehicle: ${data.vehicle}\n` +
    `Passengers: ${data.passengers}\n` +
    `Payment: ${data.payment}\n` +
    `Advance: ₹${data.advance}\n` +
    `Notes: ${data.notes || "None"}`;

  // OPEN WHATSAPP
  window.open(
    "https://wa.me/919629349482?text=" + encodeURIComponent(message),
    "_blank"
  );

  showToast("Booking Saved & WhatsApp Opened");
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
function filterFleet(event, type) {
  const cards = document.querySelectorAll('.fleet-card');
  const tabs = document.querySelectorAll('.fleet-tab');

  tabs.forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');

  cards.forEach(card => {
    const category = card.dataset.category;
    if (type === 'all' || category === type) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
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
const touristPlaces = [
  // === BEACHES (10) ===
  {
    name: "Rock Beach",
    img: "images/rock-beach.jpg",
    category: "beach",
    desc: "Famous rocky promenade ideal for sunrise walks and evening relaxation.",
    map: "https://goo.gl/maps/MrrVhA1p8eE9rzfH7"
  },
  {
    name: "Paradise Beach",
    img: "images/paradise-beach.jpg",
    category: "beach",
    desc: "Golden sandy beach accessible by boat; perfect for families and swimming.",
    map: "https://goo.gl/maps/8ny1s9xh1LK2"
  },
  {
    name: "Serenity Beach",
    img: "images/serenity-beach.jpg",
    category: "beach",
    desc: "Quiet beach known for surfing and sunrise views.",
    map: "https://goo.gl/maps/9HHF9FjEvxE2"
  },
  {
    name: "Auroville Beach",
    img: "images/auroville-beach.jpg",
    category: "beach",
    desc: "Popular beach near Auroville, great for swimming and photography.",
    map: "https://goo.gl/maps/a7ZrN9hoNQc5"
  },
  {
    name: "Eden Beach",
    img: "images/eden-beach.jpg",
    category: "beach",
    desc: "Blue Flag certified beach known for safety, amenities, and coastal beauty.",
    map: "https://goo.gl/maps/AXTJEeQKwhT2"
  },
  {
    name: "Quiet Beach",
    img: "images/quiet-beach.jpg",
    category: "beach",
    desc: "Less crowded shoreline ideal for peaceful walks.",
    map: "https://goo.gl/maps/5AzDtumLspQ2"
  },
  {
    name: "Reppo Beach",
    img: "images/reppo-beach.jpg",
    category: "beach",
    desc: "Small yet clean beach near Auroville with scenic views.",
    map: "https://goo.gl/maps/7X6gkACqgJM2"
  },
  {
    name: "Promenade North Beach",
    img: "images/north-beach.jpg",
    category: "beach",
    desc: "Extension of Rock Beach ideal for jogging and photos.",
    map: "https://goo.gl/maps/8eViSp3w5G82"
  },
  {
    name: "Plage Paradiso",
    img: "images/plage-paradiso.jpg",
    category: "beach",
    desc: "Secluded sandbank connected by boat, great for family outings.",
    map: "https://goo.gl/maps/8ny1s9xh1LK2"
  },
  {
    name: "Veerampattinam Beach",
    img: "images/veerampattinam.jpg",
    category: "beach",
    desc: "Large beach famous for processions and festivals.",
    map: "https://goo.gl/maps/MgSzEYy1Ypm"
  },

  // === AUROVILLE (10) ===
  {
    name: "Matrimandir Viewpoint",
    img: "images/matrimandir.jpg",
    category: "auroville",
    desc: "Iconic golden sphere and meditation center — heart of Auroville.",
    map: "https://goo.gl/maps/JAXRpEJdLUV2"
  },
  {
    name: "Auroville Visitors Centre",
    img: "images/visitors-center.jpg",
    category: "auroville",
    desc: "Information center with exhibitions, cafes, and craft shops.",
    map: "https://goo.gl/maps/yE5nz1vJTkF2"
  },
  {
    name: "Sadhana Forest",
    img: "images/sadhana-forest.jpg",
    category: "auroville",
    desc: "Eco-community dedicated to reforestation and sustainable living.",
    map: "https://goo.gl/maps/7sMAg3Mh2b72"
  },
  {
    name: "Auroville Beach Road",
    img: "images/auroville-road.jpg",
    category: "auroville",
    desc: "Scenic road connecting Auroville to the beach.",
    map: "https://goo.gl/maps/9T9jQw4FhK92"
  },
  {
    name: "Auroville Botanical Garden",
    img: "images/auroville-garden.jpg",
    category: "auroville",
    desc: "Natural green campus with rare plants and eco-education.",
    map: "https://goo.gl/maps/YHCDq8i8bWw"
  },
  {
    name: "Solitude Farm",
    img: "images/solitude-farm.jpg",
    category: "auroville",
    desc: "Organic farm with workshops and local food café.",
    map: "https://goo.gl/maps/jNM8XZo9YFs"
  },
  {
    name: "Auroville Bakery",
    img: "images/auroville-bakery.jpg",
    category: "auroville",
    desc: "Famous bakery offering fresh breads, pastries, and European-style treats.",
    map: "https://goo.gl/maps/ZFg7Nzy1AN92"
  },
  {
    name: "Auroville Forest Trails",
    img: "images/auroville-forest.jpg",
    category: "auroville",
    desc: "Green walking trails ideal for nature lovers.",
    map: "https://goo.gl/maps/5m6BtFwFhK52"
  },
  {
    name: "Auroville Amphitheatre",
    img: "images/auroville-amphi.jpg",
    category: "auroville",
    desc: "Open-air space hosting cultural and meditation events.",
    map: "https://goo.gl/maps/8gJtNqXgL182"
  },
  {
    name: "Unity Pavilion",
    img: "images/unity-pavilion.jpg",
    category: "auroville",
    desc: "Cultural center for exhibitions, meetings, and workshops.",
    map: "https://goo.gl/maps/LDo4M8Dq7VG2"
  },

  // === TEMPLES (10) ===
  {
    name: "Manakula Vinayagar Temple",
    img: "images/manakula.jpg",
    category: "temple",
    desc: "Historic Ganesha temple near the beach, known for blessings.",
    map: "https://goo.gl/maps/wMf1qy2Mptn"
  },
  {
    name: "Vedapureeswarar Temple",
    img: "images/vedapureeswarar.jpg",
    category: "temple",
    desc: "Ancient Shiva temple located in the Tamil quarter.",
    map: "https://goo.gl/maps/KL6QEzpVVgm"
  },
  {
    name: "Pratyangira Devi Temple",
    img: "images/pratyangira.jpg",
    category: "temple",
    desc: "Powerful temple famous for homams and healing rituals.",
    map: "https://goo.gl/maps/bB7FSWXsY8C2"
  },
  {
    name: "Auroville Ilankaaliamman Temple",
    img: "images/isai-amman.jpg",
    category: "temple",
    desc: "Local goddess temple near Auroville forest area.",
    map: "https://goo.gl/maps/sqmnZyA5v782"
  },
  {
    name: "Varadaraja Perumal Temple",
    img: "images/varadaraja.jpg",
    category: "temple",
    desc: "Famous Vishnu temple with Dravidian architecture.",
    map: "https://goo.gl/maps/FAe2zJQ7p1Q2"
  },
  {
    name: "Kamakchi Amman Temple",
    img: "images/kamakchi.jpg",
    category: "temple",
    desc: "Historic Amman temple with vibrant festivals.",
    map: "https://goo.gl/maps/LQZCPXeYF3N2"
  },
  {
    name: "Sithananda Swamy Temple",
    img: "images/sithananda.jpg",
    category: "temple",
    desc: "Famous spiritual center in Karuvadikuppam.",
    map: "https://goo.gl/maps/Z9nbB4ruVmG2"
  },
  {
    name: "Arulmigu Muthumariamman Temple",
    img: "images/mariammam.jpg",
    category: "temple",
    desc: "Powerful temple dedicated to Mariamman deity.",
    map: "https://goo.gl/maps/89Lb8Z7np7P2"
  },
  {
    name: "Sri Ayyappan Temple",
    img: "images/ayyappan.jpg",
    category: "temple",
    desc: "Popular pilgrimage spot following Kerala traditions.",
    map: "https://goo.gl/maps/stnh1t9MMpr"
  },
  {
    name: "Irumbai Maha Kaleshwarar Temple",
    img: "images/irumbai.jpg",
    category: "temple",
    desc: "Ancient Shiva temple near Auroville.",
    map: "https://goo.gl/maps/LK4V5VdX3XH2"
  },

  // === PARKS & NATURE (10) ===
  {
    name: "Botanical Garden",
    img: "images/botanical-garden.jpg",
    category: "park",
    desc: "Large garden with musical fountain and rare plants.",
    map: "https://goo.gl/maps/D5Qnr1EVmK12"
  },
  {
    name: "Bharathi Park",
    img: "images/bharathi-park.jpg",
    category: "park",
    desc: "Central park surrounded by heritage buildings.",
    map: "https://goo.gl/maps/8w8tFhfvKJH2"
  },
  {
    name: "Rajiv Gandhi Statue Park",
    img: "images/rajiv-gandhi.jpg",
    category: "park",
    desc: "Small landscaped park with a tall statue.",
    map: "https://goo.gl/maps/ybWADF6fTy62"
  },
  {
    name: "Science Park",
    img: "images/science-park.jpg",
    category: "park",
    desc: "Interactive learning park for children and families.",
    map: "https://goo.gl/maps/yTqK5tQL2t52"
  },
  {
    name: "Ousteri Lake",
    img: "images/ousteri.jpg",
    category: "park",
    desc: "Wetland reserve offering boating and birdwatching.",
    map: "https://goo.gl/maps/dfsdgju89di"
  },
  {
    name: "Chunnambar Backwaters",
    img: "images/backwaters.jpg",
    category: "park",
    desc: "Scenic boating spot near Paradise Beach.",
    map: "https://goo.gl/maps/Z6uA8D9dY1S2"
  },
  {
    name: "Pondicherry Lighthouse Viewpoint",
    img: "images/lighthouse.jpg",
    category: "park",
    desc: "Tall lighthouse offering panoramic sea views.",
    map: "https://goo.gl/maps/78S6zzY9FHn"
  },
  {
    name: "Ariyankuppam River Bank",
    img: "images/riverbank.jpg",
    category: "park",
    desc: "Calm riverside location for photography.",
    map: "https://goo.gl/maps/9QhCEXM1PZ92"
  },
  {
    name: "Karaikal Beach Park",
    img: "images/karaikal-beach.jpg",
    category: "park",
    desc: "Family-friendly beach area with seating and food stalls.",
    map: "https://goo.gl/maps/hszVRTjfvEq"
  },
  {
    name: "Yanam Riverfront Park",
    img: "images/yanam-park.jpg",
    category: "park",
    desc: "Beautiful walkway along the Godavari river.",
    map: "https://goo.gl/maps/s4weu9PFBM92"
  },

  // === MUSEUMS & HERITAGE (10) ===
  {
    name: "Pondicherry Museum",
    img: "images/museum.jpg",
    category: "museum",
    desc: "Artifacts from Chola, Pallava, and French colonial periods.",
    map: "https://goo.gl/maps/JzQCAJ9FjVQ2"
  },
  {
    name: "French War Memorial",
    img: "images/french-war.jpg",
    category: "museum",
    desc: "Historic memorial honoring WW1 soldiers.",
    map: "https://goo.gl/maps/q6uX7tGgW6B2"
  },
  {
    name: "Bharathiyar Museum",
    img: "images/bharathiyar.jpg",
    category: "museum",
    desc: "House of poet Subramania Bharathi with exhibits and manuscripts.",
    map: "https://goo.gl/maps/xes8QbATj5w"
  },
  {
    name: "Jawahar Toy Museum",
    img: "images/toy-museum.jpg",
    category: "museum",
    desc: "Children’s museum with a large collection of dolls and toys.",
    map: "https://goo.gl/maps/4GVFkF4oxxN2"
  },
  {
    name: "Chandannagar Museum",
    img: "images/chandannagar.jpg",
    category: "museum",
    desc: "Showcases the French colonial history of the region.",
    map: "https://goo.gl/maps/5h8yPcG4dZ82"
  },
  {
    name: "Archaeological Museum",
    img: "images/archaeology.jpg",
    category: "museum",
    desc: "Exhibits ancient relics from Arikamedu and surrounding regions.",
    map: "https://goo.gl/maps/2fW1Yp2M9qr"
  },
  {
    name: "Arikamedu Ancient Port",
    img: "images/arikamedu.jpg",
    category: "museum",
    desc: "Archaeological site showing Roman trading settlement ruins.",
    map: "https://goo.gl/maps/ad57s4YrYyA2"
  },
  {
    name: "Gandhi Statue & Promenade",
    img: "images/gandhi.jpg",
    category: "museum",
    desc: "Iconic seafront landmark with history and open-air space.",
    map: "https://goo.gl/maps/yN7jvV3xJXQ2"
  },
  {
    name: "Old Lighthouse",
    img: "images/old-lighthouse.jpg",
    category: "museum",
    desc: "Historic lighthouse symbolizing colonial architecture.",
    map: "https://goo.gl/maps/AG6kvp9SWNn"
  },
  {
    name: "French Quarter Heritage Walk",
    img: "images/french-quarter.jpg",
    category: "museum",
    desc: "Walk through yellow colonial houses, cafes & churches.",
    map: "https://goo.gl/maps/M6rdh6ZJh8n"
  }
];
let visiblePlaces = 12;

function renderTourPlaces() {
  const grid = document.getElementById("tour-grid");
  grid.innerHTML = touristPlaces
    .slice(0, visiblePlaces)
    .map(
      place => `
      <div class="fleet-card tour-item" data-category="${place.category}">
        <img src="${place.img}" class="fleet-img">
        <div class="p-4">
          <h4 class="font-semibold">${place.name}</h4>
          <p class="text-sm text-slate-600">${place.desc}</p>
          <a href="${place.map}" target="_blank" class="btn-secondary mt-2 block text-center">
            View on Google Maps
          </a>
        </div>
      </div>`
    )
    .join("");
}

function loadMoreTourist() {
  visiblePlaces += 12;
  renderTourPlaces();
  if (visiblePlaces >= touristPlaces.length) {
    document.getElementById("loadMoreBtn").style.display = "none";
  }
}

function filterTour(event, category) {
  const items = document.querySelectorAll(".tour-item");
  const filters = document.querySelectorAll(".tour-filter");

  filters.forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  items.forEach(item => {
    item.style.display =
      category === "all" || item.dataset.category === category
        ? "block"
        : "none";
  });
}

document.addEventListener("DOMContentLoaded", renderTourPlaces);











