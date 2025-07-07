let currentPage = 1;
const photosPerPage = 12;
let allPhotos = [];
let displayedPhotos = [];

// Fetch photos from API
async function fetchPhotos() {
  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/products");
    allPhotos = await response.json();
    displayPhotos();
  } catch (error) {
    console.error("Error fetching photos:", error);
    document.getElementById("loading").innerHTML =
      '<p class="text-red-500 text-center">Failed to load photos. Please try again later.</p>';
  }
}

// Display photos
function displayPhotos() {
  const photosGrid = document.getElementById("photosGrid");
  const loading = document.getElementById("loading");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  const startIndex = (currentPage - 1) * photosPerPage;
  const endIndex = startIndex + photosPerPage;
  const photosToShow = allPhotos.slice(startIndex, endIndex);

  if (photosToShow.length === 0) {
    loading.classList.add("hidden");
    return;
  }

  photosToShow.forEach((photo, index) => {
    const photoCard = document.createElement("div");
    photoCard.className =
      "photo-card bg-white rounded-lg shadow-md overflow-hidden fade-in";
    photoCard.style.animationDelay = `${index * 0.1}s`;

    photoCard.innerHTML = `
              <div class="aspect-w-1 aspect-h-1 w-full h-64 bg-gray-200 overflow-hidden">
                  <img src="${photo.images[0]}" 
                       alt="${photo.title}" 
                       class="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                       onclick="openModal('${photo.images[0]}', '${photo.title}')">
              </div>
              <div class="p-4">
                  <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">${photo.title}</h3>
                  <p class="text-sm text-gray-600 mb-3">Category: ${photo.category.name}</p>
                  <p class="text-xs text-gray-600">Description: ${photo.description}</p>
              </div>
          `;

    photosGrid.appendChild(photoCard);
  });

  displayedPhotos = displayedPhotos.concat(photosToShow);
  loading.classList.add("hidden");
  photosGrid.classList.remove("hidden");

  // Show load more button if there are more photos
  if (displayedPhotos.length < allPhotos.length) {
    loadMoreBtn.classList.remove("hidden");
  } else {
    loadMoreBtn.classList.add("hidden");
  }
}

// Load more photos
function loadMorePhotos() {
  currentPage++;
  displayPhotos();
}

// Open modal for full size image
function openModal(imageUrl, title) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4";
  modal.innerHTML = `
          <div class="relative max-w-4xl max-h-full">
              <button onclick="closeModal()" class="absolute top-4 right-4 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75">
                  ×
              </button>
              <img src="${imageUrl}" alt="${title}" class="max-w-full max-h-full rounded-lg">
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                  <h3 class="text-lg font-semibold">${title}</h3>
              </div>
          </div>
      `;

  document.body.appendChild(modal);
  modal.onclick = function (e) {
    if (e.target === modal) {
      closeModal();
    }
  };
}

// Close modal
function closeModal() {
  const modal = document.querySelector(".fixed.inset-0");
  if (modal) {
    modal.remove();
  }
}

// Scroll to gallery
function scrollToGallery() {
  document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
}

// Event listeners
document
  .getElementById("loadMoreBtn")
  .addEventListener("click", loadMorePhotos);

// Initialize
fetchPhotos();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const features = document.querySelector(".features");

setTimeout(() => {
  features.classList.remove("opacity-0");
  features.classList.add("fade-in");
}, 1000);
