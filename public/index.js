const randomMapQuantity = document.getElementById("mapQuantity");
const mapInfo = document.getElementById("mapInfo");
const mediaQuery = window.matchMedia("(max-width: 768px)");

document.getElementById("randomOsuMap").addEventListener("click", async function (e) {
  //Immediate Calls ================================
  e.preventDefault();
  let recursions = randomMapQuantity.value;
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

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

    while (recursions > 0) {
      const randomNumber = Math.floor(Math.random() * 2500000) + 1;
      const url = `https://osu.ppy.sh/beatmapsets/${randomNumber}`;

      try {
        const exists = await checkLinkExists(url, controller);
        if (exists) {
          appendMap(url);
          foundMaps++;
        } else {
          let errorMsg = document.createElement("p");
          errorMsg.textContent = `Attempt failed (ID: ${randomNumber})`;
          errorMsg.style.color = "#888";
          errorMsg.style.fontSize = "0.8em";
          mapInfo.appendChild(errorMsg);
        }
      } catch (error) {
        console.error(`Error checking map ${randomNumber}:`, error);
      }

      recursions -= 1;
    }

    // Update loading message
    loadingMsg.textContent = `Search complete! Found ${foundMaps} maps.`;
    loadingMsg.style.fontWeight = "bold";

    if (foundMaps === 0) {
      mapInfo.innerHTML += `<p style="color: orange">No maps were found. Try again?</p>`;
    }
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
