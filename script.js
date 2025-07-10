// Waste Sorting Assistant - Main Script
document.addEventListener('DOMContentLoaded', function () {
    // 1. Waste Categories
    const wasteData = {
        categories: {
            plastic: {
                title: "Plastic Recycling Guide",
                icon: "🧴",
                keywords: ["bottle", "container", "bag", "wrapper", "plastic"],
                content: `
                    <h3>♻ How to Recycle Plastic</h3>
                    <p><strong>Recyclable:</strong> Bottles (water, soda, shampoo), containers (yogurt, margarine), jugs (milk, detergent)</p>
                    <p><strong>Not Recyclable:</strong> Plastic bags, straws, styrofoam, plastic wrap</p>
                    <ul>
                        <li>Rinse containers before recycling</li>
                        <li>Remove caps and lids (check local rules)</li>
                        <li>Don't bag recyclables - place loose in bin</li>
                    </ul>
                `
            },
            paper: {
                title: "Paper Recycling Guide",
                icon: "📄",
                keywords: ["newspaper", "cardboard", "magazine", "box", "paper"],
                content: `
                    <h3>♻ How to Recycle Paper</h3>
                    <p><strong>Recyclable:</strong> Newspapers, magazines, office paper, cardboard boxes, paper bags</p>
                    <p><strong>Not Recyclable:</strong> Soiled paper, wax-coated paper, receipts, paper towels</p>
                    <ul>
                        <li>Flatten cardboard boxes</li>
                        <li>Remove plastic windows from envelopes</li>
                        <li>Keep paper dry and clean</li>
                    </ul>
                `
            },
            glass: {
                title: "Glass Recycling Guide",
                icon: "🍾",
                keywords: ["bottle", "jar", "glass", "container"],
                content: `
                    <h3>♻ How to Recycle Glass</h3>
                    <p><strong>Recyclable:</strong> Bottles (beer, wine, soda), food jars (pasta sauce, jam)</p>
                    <p><strong>Not Recyclable:</strong> Drinking glasses, ceramics, mirrors, light bulbs</p>
                    <ul>
                        <li>Rinse containers thoroughly</li>
                        <li>Remove metal lids (recycle separately)</li>
                        <li>Don't break glass - it's harder to recycle</li>
                    </ul>
                `
            },
            metal: {
                title: "Metal Recycling Guide",
                icon: "🥫",
                keywords: ["can", "foil", "metal", "tin"],
                content: `
                    <h3>♻ How to Recycle Metal</h3>
                    <p><strong>Recyclable:</strong> Aluminum cans, tin cans, clean aluminum foil, empty aerosol cans</p>
                    <p><strong>Not Recyclable:</strong> Paint cans, propane tanks, scrap metal</p>
                    <ul>
                        <li>Rinse cans to remove food residue</li>
                        <li>Flatten aluminum cans if possible</li>
                        <li>Check for local scrap metal recycling</li>
                    </ul>
                `
            },
            organic: {
                title: "Organic Waste Guide",
                icon: "🍎",
                keywords: ["food", "compost", "yard", "organic"],
                content: `
                    <h3>♻ How to Handle Organic Waste</h3>
                    <p><strong>Compostable:</strong> Fruit/vegetable scraps, eggshells, coffee grounds, yard trimmings</p>
                    <p><strong>Not Compostable:</strong> Meat, dairy, oils, pet waste</p>
                    <ul>
                        <li>Use a compost bin or municipal collection</li>
                        <li>Bury food scraps to avoid pests</li>
                        <li>Mix "greens" and "browns" for better compost</li>
                    </ul>
                `
            },
            hazardous: {
                title: "Hazardous Waste Guide",
                icon: "⚠️",
                keywords: ["battery", "chemical", "electronic", "hazardous"],
                content: `
                    <h3>⚠ Hazardous Waste Disposal</h3>
                    <p><strong>Hazardous Items:</strong> Batteries, electronics, paint, chemicals, light bulbs</p>
                    <p><strong>Safe Disposal:</strong> Never put in regular trash or recycling</p>
                    <ul>
                        <li>Find local hazardous waste collection sites</li>
                        <li>Check for retailer take-back programs</li>
                        <li>Keep in original containers when possible</li>
                    </ul>
                `
            }
        },
        searchWaste(term) {
            const results = [];
            const t = term.toLowerCase();
            for (const key in this.categories) {
                const item = this.categories[key];
                if (key.includes(t) || item.title.toLowerCase().includes(t) ||
                    item.keywords.some(k => k.includes(t))) {
                    results.push(key);
                }
            }
            return results;
        }
    };

    // 2. DOM Bindings
    const get = id => document.getElementById(id);
    const elements = {
        wasteSearch: get('waste-search'),
        searchResults: get('search-results'),
        wasteImage: get('waste-image'),
        uploadBtn: get('upload-btn'),
        fileLabelText: get('file-label-text'),
        imagePreview: get('image-preview'),
        guideDetails: get('guide-details'),
        guideTitle: get('guide-title'),
        guideContent: get('guide-content'),
        closeBtn: get('close-btn'),
        imageResults: get('image-results'),
        identifiedWaste: get('identified-waste'),
        wasteInstructions: get('waste-instructions'),
        locationInput: get('location-input'),
        map: get('map'),
        results: get('results'),
        locationSearchBtn: get('search-btn') // Used on location.html
    };

    // 3. Guide Search Logic
    window.searchWaste = function () {
        const query = elements.wasteSearch?.value.trim();
        if (!query) return showMessage('Please enter a search term.', 'error');
        const matches = wasteData.searchWaste(query);
        if (matches.length > 0) showGuide(matches[0]);
        else showMessage(`No results found for "${query}"`, 'error');
    };

    // 4. Show Guide
    window.showGuide = function (key) {
        const category = wasteData.categories[key];
        if (!category) return;
        elements.guideTitle.textContent = category.title;
        elements.guideContent.innerHTML = category.content;
        elements.guideDetails.classList.remove('hidden');
        elements.guideDetails.scrollIntoView({ behavior: 'smooth' });
    };

    // 5. Close Guide
    window.closeGuide = function () {
        elements.guideDetails.classList.add('hidden');
    };

    // 6. Image Upload and Preview
    elements.wasteImage?.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        elements.fileLabelText.textContent = file.name;
        const reader = new FileReader();
        reader.onload = evt => {
            elements.imagePreview.innerHTML = `<img src="${evt.target.result}" alt="Uploaded Image">`;
        };
        reader.readAsDataURL(file);
    });

    // 7. Identify Waste (Mock)
    window.identifyWaste = function () {
        const file = elements.wasteImage?.files?.[0];
        if (!file) return showMessage('Please upload an image.', 'error');
        showMessage('Identifying waste...', 'loading');
        setTimeout(() => {
            const mock = { name: 'Plastic Bottle', category: 'plastic', confidence: 0.93 };
            displayIdentificationResults(mock);
        }, 1500);
    };

    function displayIdentificationResults(result) {
        elements.imageResults.classList.remove('hidden');
        elements.identifiedWaste.textContent =
            `Identified as: ${result.name} (${Math.round(result.confidence * 100)}%)`;
        elements.wasteInstructions.innerHTML = wasteData.categories[result.category]?.content || '';
    }

   // script.js

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body;

  if (document.querySelector('.location-container')) {
    // We are on location.html page
    initLocationPage();
  } else if (document.querySelector('.guide-container')) {
    // We are on guide.html page
    initGuidePage();
  } else if (document.querySelector('.home-container')) {
    // Home page - no special JS yet, but placeholder
  }
});

// --------------- Location Page Functions -------------------

let map;
let service;
let infowindow;
let markers = [];

function initLocationPage() {
  const input = document.getElementById("location-input");
  const button = document.getElementById("location-search-btn");
  const resultsDiv = document.getElementById("results");

  const defaultLocation = { lat: 6.9271, lng: 79.8612 }; // Colombo

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 12,
  });

  infowindow = new google.maps.InfoWindow();

  button.addEventListener("click", () => {
    const address = input.value.trim();
    if (!address) {
      alert("Please enter a location to search.");
      return;
    }

    clearMarkers();
    resultsDiv.innerHTML = "";

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(14);

        const request = {
          location: location,
          radius: 5000,
          keyword: "recycling center",
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, (places, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && places.length > 0) {
            showLocationResults(places);
          } else {
            resultsDiv.innerHTML = "<p>No recycling centers found nearby.</p>";
          }
        });
      } else {
        alert("Geocode was not successful: " + status);
      }
    });
  });
}

function showLocationResults(places) {
  const resultsDiv = document.getElementById("results");

  places.forEach((place, index) => {
    const div = document.createElement("div");
    div.className = "result-item";
    div.innerHTML = `<strong>${place.name}</strong><br>${place.vicinity || place.formatted_address || ''}`;

    div.addEventListener("click", () => {
      google.maps.event.trigger(markers[index], 'click');
      map.panTo(markers[index].getPosition());
    });

    resultsDiv.appendChild(div);

    const marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name,
    });

    marker.addListener("click", () => {
      infowindow.setContent(`<div><strong>${place.name}</strong><br>${place.vicinity || place.formatted_address || ''}</div>`);
      infowindow.open(map, marker);
    });

    markers.push(marker);
  });
}

function clearMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
}

// --------------- Guide Page Functions -------------------

const recyclingItems = [
  {
    name: "Plastic Bottle",
    description: "Rinse and recycle plastic bottles in the plastic bin.",
  },
  {
    name: "Glass Jar",
    description: "Clean glass jars and recycle in the glass bin.",
  },
  {
    name: "Aluminum Can",
    description: "Recycle aluminum cans in the metal bin.",
  },
  {
    name: "Paper",
    description: "Recycle clean paper in the paper bin.",
  },
  {
    name: "Cardboard",
    description: "Flatten cardboard boxes and recycle with paper.",
  },
  {
    name: "Battery",
    description: "Do NOT throw batteries in regular trash; use special drop-off locations.",
  },
];

function initGuidePage() {
  const input = document.getElementById("guide-search-input");
  const button = document.getElementById("guide-search-btn");
  const resultsDiv = document.getElementById("guide-results");

  button.addEventListener("click", () => {
    const query = input.value.trim().toLowerCase();
    resultsDiv.innerHTML = "";

    if (!query) {
      resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
      return;
    }

    const filtered = recyclingItems.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    filtered.forEach(item => {
      const div = document.createElement("div");
      div.className = "result-item";
      div.innerHTML = `<strong>${item.name}</strong><br>${item.description}`;
      resultsDiv.appendChild(div);
    });
  });
}

    }

    function reverseGeocode(latLng, geocoder) {
        geocoder.geocode({ location: latLng }, (res, status) => {
            if (status === 'OK' && res[0]) {
                elements.results.innerHTML = `
                    <h3>${res[0].formatted_address}</h3>
                    <button id="find-recycling" class="btn">Find Recycling Centers Nearby</button>
                `;
                document.getElementById('find-recycling').onclick = () => findRecyclingCenters(latLng, window.map);
            }
        });
    }

    function findRecyclingCenters(location, map) {
        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location,
            radius: 5000,
            keyword: "recycling center"
        }, (results, status) => {
            if (status === 'OK') {
                let html = "<h3>Nearby Recycling Centers</h3><ul>";
                results.slice(0, 5).forEach(place => {
                    html += `<li><strong>${place.name}</strong><br>${place.vicinity}</li>`;
                    new google.maps.Marker({ map, position: place.geometry.location });
                });
                html += "</ul>";
                elements.results.innerHTML += html;
            }
        });
    }

    function showMessage(message, type = 'info') {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.innerHTML = type === 'loading' ? `<span class="spinner"></span> ${message}` : message;
        elements.searchResults?.appendChild(msg);
        if (type !== 'loading') setTimeout(() => msg.remove(), 4000);
    }
});
