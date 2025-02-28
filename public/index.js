const randomMapQuantity = document.getElementById("osuMapQuantity");
const mapInfo = document.getElementById("mapInfo");
const logo = document.getElementById("logo");
const dropdown = document.getElementById("dropdown");
const mainPage = document.getElementById("main");
const mobileScreen = window.matchMedia("(max-width: 768px)");

// Function to close dropdown when clicking outside
function clickOffDropdown(e) {
  // Don't close if clicking on a link inside the dropdown
  if (e.target.tagName === 'A' && dropdown.contains(e.target)) {
    return;
  }
  
  // Get dropdown position and dimensions
  const dropdownRect = dropdown.getBoundingClientRect();
  const logoRect = logo.getBoundingClientRect();
  
  // Check if click is outside both dropdown and logo
  const isOutsideDropdown = e.clientX < dropdownRect.left || 
                           e.clientX > dropdownRect.right || 
                           e.clientY < dropdownRect.top || 
                           e.clientY > dropdownRect.bottom;
                           
  const isOutsideLogo = e.clientX < logoRect.left || 
                       e.clientX > logoRect.right || 
                       e.clientY < logoRect.top || 
                       e.clientY > logoRect.bottom;
  
  if (dropdown.classList.contains("show") && isOutsideDropdown && isOutsideLogo) {
    dropdown.classList.remove("show");
    mainPage.classList.remove("fade");
    // Remove the event listener when dropdown is closed
    document.removeEventListener("click", clickOffDropdown);
  }
}

// Logo click behavior
if (mobileScreen.matches) {
  logo.addEventListener("click", function (e) {
    // Prevent the click from immediately triggering the document click handler
    e.stopPropagation();
    // Set dropdown content
    dropdown.innerHTML = `<div id="dropdown-inner">
        <a href="/">Home</a>
        <a href="/aboutme">About Me</a>
        <a href="/contact">Contact</a>
        </div>
      `;
    
    // Ensure links are clickable by adding event listeners
    const links = dropdown.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent the click from bubbling up
        // Navigate to the href
        window.location.href = this.getAttribute('href');
      });
    });
    // Toggle dropdown visibility
    const isShowing = dropdown.classList.toggle("show");
    if (isShowing) {
      mainPage.classList.add("fade");
      // Add click listener with a small delay to avoid immediate triggering
      setTimeout(() => {
        document.addEventListener("click", clickOffDropdown);
      }, 100);
    } else {
      mainPage.classList.remove("fade");
      document.removeEventListener("click", clickOffDropdown);
    }
  });
} else {
  // On desktop, logo links to home
  logo.addEventListener("click", function () {
    window.location.href = "/";
  });
}

document.getElementById("randomOsuMap").addEventListener("click", async function (e) {
  //Immediate Calls ================================
  e.preventDefault();
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 30000); // Increased timeout to 30 seconds since we're waiting for exact map count

  // Clear previous results
  mapInfo.innerHTML = "";
  // Results style list
  const mapInfoStyles = {
    display: "flex",
    flexDirection: "column",
    width: "10vw",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    position: "fixed",
    top: "40px",
    paddingLeft: "10px",
  };
  // Apply all styles at once
  Object.assign(mapInfo.style, mapInfoStyles);
  // Add loading indicator
  const loadingMsg = document.createElement("p");
  loadingMsg.textContent = `Searching for ${randomMapQuantity.value} maps...`;
  mapInfo.appendChild(loadingMsg);
  //Try links / catch errors while testing if links exist
  try {
    await searchForMap(controller);
  } catch (error) {
    console.error(error);
    mapInfo.innerHTML += `<p style="color: red">Error: ${error.message || "Unknown error occurred"}</p>`;
  } finally {
    clearTimeout(timeout);
  }

  // Helper Functions ================================
  async function searchForMap(controller) {
    let foundMaps = 0;
    const requestedMaps = parseInt(randomMapQuantity.value);
    // Keep searching until we find the requested number of maps
    while (foundMaps < requestedMaps) {
      const randomNumber = Math.floor(Math.random() * 2500000) + 1;
      const url = `https://osu.ppy.sh/beatmapsets/${randomNumber}`;
      try {
        const exists = await checkLinkExists(url, controller);
        if (exists) {
          appendMap(url);
          foundMaps++;
          // Update loading message with progress
          loadingMsg.textContent = `Found ${foundMaps}/${requestedMaps} maps...`;
        }
      } catch (error) {
        console.error(`Error checking map ${randomNumber}:`, error);
        // Don't add error messages to the DOM, just log to console
      }
    }
    // Update loading message when complete
    loadingMsg.textContent = `Search complete! Found ${foundMaps} maps.`;
    loadingMsg.style.fontWeight = "bold";
  }

  async function checkLinkExists(url, controller) {
    try {
      const response = await fetch(`/check-link?url=${encodeURIComponent(url)}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      return data.exists;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request aborted due to timeout");
      } else {
        console.error("Error checking link:", error);
      }
      throw error;
    }
  }

  function appendMap(url) {
    const mapContainer = document.createElement("div");
    mapContainer.style.margin = "10px 0";
    mapContainer.style.padding = "8px";
    mapContainer.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    mapContainer.style.borderRadius = "4px";

    const link = document.createElement("a");
    link.href = url;
    link.textContent = `Beatmap #${url.split("/").pop()}`;
    link.style.color = "#4af";
    link.style.display = "block";
    link.target = "_blank";

    mapContainer.appendChild(link);
    mapInfo.appendChild(mapContainer);
  }
});
