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
    map: "https://maps.app.goo.gl/UG8zCfhQpZZSHfSx5"
  },
  {
    name: "Paradise Beach",
    img: "images/paradise-beach.jpg",
    category: "beach",
    desc: "Golden sandy beach accessible by boat; perfect for families and swimming.",
    map: "https://maps.app.goo.gl/fAxjMhMfmf81Qq8UA"
  },
  {
    name: "Serenity Beach",
    img: "images/serenity-beach.jpg",
    category: "beach",
    desc: "Quiet beach known for surfing and sunrise views.",
    map: "https://maps.app.goo.gl/RgSheWxpx2i9Pdf4A"
  },
  {
    name: "Auroville Beach",
    img: "images/auroville-beach.jpg",
    category: "beach",
    desc: "Popular beach near Auroville, great for swimming and photography.",
    map: "https://maps.app.goo.gl/5gXqGj2dmJuPoRJj8"
  },
  {
    name: "Eden Beach",
    img: "images/eden-beach.jpg",
    category: "beach",
    desc: "Blue Flag certified beach known for safety, amenities, and coastal beauty.",
    map: "https://maps.app.goo.gl/T3GkgD81PqB5CGRn6"
  },
  {
    name: "Quiet Beach",
    img: "images/quiet-beach.jpg",
    category: "beach",
    desc: "Less crowded shoreline ideal for peaceful walks.",
    map: "https://maps.app.goo.gl/RoNPW45vvpRx5bXW6"
  },
  {
    name: "Reppo Beach",
    img: "images/reppo-beach.jpg",
    category: "beach",
    desc: "Small yet clean beach near Auroville with scenic views.",
    map: "https://maps.app.goo.gl/woqGFh2PL9b1ytWM7"
  },
  {
    name: "Promenade North Beach",
    img: "images/north-beach.jpg",
    category: "beach",
    desc: "Extension of Rock Beach ideal for jogging and photos.",
    map: "https://maps.app.goo.gl/82ajh6wnNZ1Gmk1C8"
  },
  {
    name: "Plage Paradiso",
    img: "images/plage-paradiso.jpg",
    category: "beach",
    desc: "Secluded sandbank connected by boat, great for family outings.",
    map: "https://maps.app.goo.gl/nkoSFCBm64W13tZh9"
  },
  {
    name: "Veerampattinam Beach",
    img: "images/veerampattinam.jpg",
    category: "beach",
    desc: "Large beach famous for processions and festivals.",
    map: "https://maps.app.goo.gl/HTXcNzh1BpywSWTf7"
  },

  // === AUROVILLE (10) ===
  {
    name: "Matrimandir Viewpoint",
    img: "images/matrimandir.jpg",
    category: "auroville",
    desc: "Iconic golden sphere and meditation center — heart of Auroville.",
    map: "https://maps.app.goo.gl/EaC4exK69wh7aatq6"
  },
  {
    name: "Auroville Visitors Centre",
    img: "images/visitors-center.jpg",
    category: "auroville",
    desc: "Information center with exhibitions, cafes, and craft shops.",
    map: "https://maps.app.goo.gl/soXRKK98WaB6dosj6"
  },
  {
    name: "Sadhana Forest",
    img: "images/sadhana-forest.jpg",
    category: "auroville",
    desc: "Eco-community dedicated to reforestation and sustainable living.",
    map: "https://maps.app.goo.gl/WZjfL414311MiXdJ6"
  },
  {
    name: "Auroville Beach Road",
    img: "images/auroville-road.jpg",
    category: "auroville",
    desc: "Scenic road connecting Auroville to the beach.",
    map: "https://maps.app.goo.gl/mre8LpaaKUfiHkKF9"
  },
  {
    name: "Auroville Botanical Garden",
    img: "images/auroville-garden.jpg",
    category: "auroville",
    desc: "Natural green campus with rare plants and eco-education.",
    map: "https://maps.app.goo.gl/yXycVuYyp1CAJ3Ha7"
  },
  {
    name: "Solitude Farm",
    img: "images/solitude-farm.jpg",
    category: "auroville",
    desc: "Organic farm with workshops and local food café.",
    map: "https://maps.app.goo.gl/kJGHhs7mEqszmxgdA"
  },
  {
    name: "Auroville Bakery",
    img: "images/auroville-bakery.jpg",
    category: "auroville",
    desc: "Famous bakery offering fresh breads, pastries, and European-style treats.",
    map: "https://maps.app.goo.gl/WDKb8Spf1x3QoVSx7"
  },
  {
    name: "Auroville Forest Trails",
    img: "images/auroville-forest.jpg",
    category: "auroville",
    desc: "Green walking trails ideal for nature lovers.",
    map: "https://maps.app.goo.gl/CMmSaftgsuwVZpKv7"
  },
  {
    name: "Auroville Amphitheatre",
    img: "images/auroville-amphi.jpg",
    category: "auroville",
    desc: "Open-air space hosting cultural and meditation events.",
    map: "https://maps.app.goo.gl/mFAGms7ySwKqebNy9"
  },
  {
    name: "Unity Pavilion",
    img: "images/unity-pavilion.jpg",
    category: "auroville",
    desc: "Cultural center for exhibitions, meetings, and workshops.",
    map: "https://maps.app.goo.gl/BzwhdM3PKq2o4TtN8"
  },

  // === TEMPLES (10) ===
  {
    name: "Manakula Vinayagar Temple",
    img: "images/manakula.jpg",
    category: "temple",
    desc: "Historic Ganesha temple near the beach, known for blessings.",
    map: "https://maps.app.goo.gl/ewjnLcezfoFq2dQX7"
  },
  {
    name: "Vedapureeswarar Temple",
    img: "images/vedapureeswarar.jpg",
    category: "temple",
    desc: "Ancient Shiva temple located in the Tamil quarter.",
    map: "https://maps.app.goo.gl/9mzdCE8BqaVSjaaP8"
  },
  {
    name: "Pratyangira Devi Temple",
    img: "images/pratyangira.jpg",
    category: "temple",
    desc: "Powerful temple famous for homams and healing rituals.",
    map: "https://maps.app.goo.gl/NaSYSQYXb5YY1xbT9"
  },
  {
    name: "Auroville Ilankaaliamman Temple",
    img: "images/isai-amman.jpg",
    category: "temple",
    desc: "Local goddess temple near Auroville forest area.",
    map: "https://maps.app.goo.gl/hxcUTSFBFMEjJssS6"
  },
  {
    name: "Varadaraja Perumal Temple",
    img: "images/varadaraja.jpg",
    category: "temple",
    desc: "Famous Vishnu temple with Dravidian architecture.",
    map: "https://maps.app.goo.gl/yMcL3ckRiKqbZSqi7"
  },
  {
    name: "Kamakchi Amman Temple",
    img: "images/kamakchi.jpg",
    category: "temple",
    desc: "Historic Amman temple with vibrant festivals.",
    map: "https://maps.app.goo.gl/6SzGZnVegEXmLUmQ8"
  },
  {
    name: "Sithananda Swamy Temple",
    img: "images/sithananda.jpg",
    category: "temple",
    desc: "Famous spiritual center in Karuvadikuppam.",
    map: "https://maps.app.goo.gl/nufXWumwXobXi4bN8"
  },
  {
    name: "Arulmigu Muthumariamman Temple",
    img: "images/mariammam.jpg",
    category: "temple",
    desc: "Powerful temple dedicated to Mariamman deity.",
    map: "https://maps.app.goo.gl/wVH7of6LdXdtMBNa6"
  },
  {
    name: "Sri Ayyappan Temple",
    img: "images/ayyappan.jpg",
    category: "temple",
    desc: "Popular pilgrimage spot following Kerala traditions.",
    map: "https://maps.app.goo.gl/Y7yLLny2a1L7ka8V6"
  },
  {
    name: "Irumbai Maha Kaleshwarar Temple",
    img: "images/irumbai.jpg",
    category: "temple",
    desc: "Ancient Shiva temple near Auroville.",
    map: "https://maps.app.goo.gl/fwGU5QwekCDDK2sU8"
  },

  // === PARKS & NATURE (10) ===
  {
    name: "Botanical Garden",
    img: "images/botanical-garden.jpg",
    category: "park",
    desc: "Large garden with musical fountain and rare plants.",
    map: "https://maps.app.goo.gl/1Y5kzyCVuDACeKAQ9"
  },
  {
    name: "Bharathi Park",
    img: "images/bharathi-park.jpg",
    category: "park",
    desc: "Central park surrounded by heritage buildings.",
    map: "https://maps.app.goo.gl/9r55n588572H8P4V7"
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
    map: "https://maps.app.goo.gl/ECGLwZ3tdQvid21V9"
  },
  {
    name: "Ousteri Lake",
    img: "images/ousteri.jpg",
    category: "park",
    desc: "Wetland reserve offering boating and birdwatching.",
    map: "https://maps.app.goo.gl/QQFpgXCd8FNSBFfG8"
  },
  {
    name: "Chunnambar Backwaters",
    img: "images/backwaters.jpg",
    category: "park",
    desc: "Scenic boating spot near Paradise Beach.",
    map: "https://maps.app.goo.gl/hQVGYqQWsm8tdwkJ6"
  },
  {
    name: "Pondicherry Lighthouse Viewpoint",
    img: "images/lighthouse.jpg",
    category: "park",
    desc: "Tall lighthouse offering panoramic sea views.",
    map: "https://maps.app.goo.gl/qH8xPNvohec5r9iy6"
  },
  {
    name: "Ariyankuppam River Bank",
    img: "images/riverbank.jpg",
    category: "park",
    desc: "Calm riverside location for photography.",
    map: "https://maps.app.goo.gl/QTRSdSRcp9rTy2ha9"
  },
  {
    name: "Karaikal Beach Park",
    img: "images/karaikal-beach.jpg",
    category: "park",
    desc: "Family-friendly beach area with seating and food stalls.",
    map: "https://maps.app.goo.gl/TohJFhcyNXQLReFX6"
  },
  {
    name: "Yanam Riverfront Park",
    img: "images/yanam-park.jpg",
    category: "park",
    desc: "Beautiful walkway along the Godavari river.",
    map: "https://maps.app.goo.gl/oXbGwoSK9cHg5mSq7"
  },

  // === MUSEUMS & HERITAGE (10) ===
  {
    name: "Pondicherry Museum",
    img: "images/museum.jpg",
    category: "museum",
    desc: "Artifacts from Chola, Pallava, and French colonial periods.",
    map: "https://maps.app.goo.gl/JR25zNE9fMbhRTjR7"
  },
  {
    name: "French War Memorial",
    img: "images/french-war.jpg",
    category: "museum",
    desc: "Historic memorial honoring WW1 soldiers.",
    map: "https://maps.app.goo.gl/27aUQVYzG3DT9yMJ9"
  },
  {
    name: "Bharathiyar Museum",
    img: "images/bharathiyar.jpg",
    category: "museum",
    desc: "House of poet Subramania Bharathi with exhibits and manuscripts.",
    map: "https://maps.app.goo.gl/sRDJgYZWDXhbvGk28"
  },
  {
    name: "Jawahar Toy Museum",
    img: "images/toy-museum.jpg",
    category: "museum",
    desc: "Children’s museum with a large collection of dolls and toys.",
    map: "https://maps.app.goo.gl/JR25zNE9fMbhRTjR7"
  },
  {
    name: "Chandannagar Museum",
    img: "images/chandannagar.jpg",
    category: "museum",
    desc: "Showcases the French colonial history of the region.",
    map: "https://maps.app.goo.gl/Y4RLtZGHhzMny9Cw9"
  },
  {
    name: "Archaeological Museum",
    img: "images/archaeology.jpg",
    category: "museum",
    desc: "Exhibits ancient relics from Arikamedu and surrounding regions.",
    map: "https://maps.app.goo.gl/hgDsTwpgAumgin697"
  },
  {
    name: "Arikamedu Ancient Port",
    img: "images/arikamedu.jpg",
    category: "museum",
    desc: "Archaeological site showing Roman trading settlement ruins.",
    map: "https://maps.app.goo.gl/W1SH3ES2GTxKxjUo8"
  },
  {
    name: "Gandhi Statue & Promenade",
    img: "images/gandhi.jpg",
    category: "museum",
    desc: "Iconic seafront landmark with history and open-air space.",
    map: "https://maps.app.goo.gl/cuoK6aAfHrFu7nsi9"
  },
  {
    name: "Old Lighthouse",
    img: "images/old-lighthouse.jpg",
    category: "museum",
    desc: "Historic lighthouse symbolizing colonial architecture.",
    map: "https://maps.app.goo.gl/h6JReaEWBJWYDjteA"
  },
  {
    name: "French Quarter Heritage Walk",
    img: "images/french-quarter.jpg",
    category: "museum",
    desc: "Walk through yellow colonial houses, cafes & churches.",
    map: "https://maps.app.goo.gl/nr3TWUR4SMdjVkyLA"
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











