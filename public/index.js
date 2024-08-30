const randomMapQuantity = document.getElementById("mapQuantity");
const mapInfo = document.getElementById("mapInfo");

document.getElementById("randomOsuMap").addEventListener("click", async function (e) {
  //Immediate Calls ================================
  e.preventDefault();
  let recursions = randomMapQuantity.value;
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);
  mapInfo.style.display = "flex";
  mapInfo.textContent = `Searching for ${randomMapQuantity.value} maps...`;

  //Try Catch Block ===============================
  try {
    await searchForMap(controller);
  } catch (error) {
    console.log(error);
  }
  // Helper Functions ================================
  async function searchForMap(controller) {
    while (recursions > 0) {
      const randomNumber = Math.floor(Math.random() * 2500000) + 1;
      const url = `https://osu.ppy.sh/beatmapsets/${randomNumber}`;
      const exists = await checkLinkExists(url, controller);
      if (exists) {
        appendMap(url);
      } else {
        let errorMsg = document.createElement("p");
        errorMsg.textContent = `Failed to find map...`;
        mapInfo.appendChild(errorMsg);
      }
      recursions -= 1;
    }
    clearInterval(timeout);
    controller.abort();
    mapInfo.append("Done!");
  }

  async function checkLinkExists(url, controller) {
    try {
      const response = await fetch(`https://dencoded.live/check-link?url=${encodeURIComponent(url)}`, { signal: controller.signal });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      if (error.name === "AbortError") {
        controller.abort();
        console.log("Request aborted due to timeout");
      } else {
        controller.abort();
        console.log("Something went wrong.");
      }
      return;
    }
  }

  function appendMap(url) {
    let link = document.createElement("a");
    link.href = url;
    link.textContent = url;
    link.style.color = "blue";
    link.target = "_blank";
    mapInfo.appendChild(link);
  }
});
