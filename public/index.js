const randomMapQuantity = document.getElementById("osuMapQuantity");
const mapInfo = document.getElementById("mapInfo");
const isMobile = window.matchMedia("(max-width: 768px)");

// Logo click behavior
const logo = document.getElementById("logo");
if (isMobile.matches) {
  // On mobile, logo toggles dropdown
  logo.addEventListener("click", function () {
    const dropdown = document.getElementById("dropdown");
    // Make sure dropdown has content before toggling
    if (!dropdown.hasChildNodes()) {
      dropdown.innerHTML = `<div>
        <a href="/aboutme">About Me</a>
        <a href="/contact">Contact</a>
        </div>
      `;
    }
    dropdown.classList.toggle("show");
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

  //Try Catch Block ===============================
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
