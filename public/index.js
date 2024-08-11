const randomMapQuantity = document.getElementById("mapQuantity");
const mapInfo = document.getElementById("mapInfo");

function getRandomNumber() {
  return Math.floor(Math.random() * 2500000) + 1;
}

async function checkLinkExists(url) {
  try {
    const response = await fetch(`https://dencoded.live/check-link?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Error fetching the link:", error);
    return;
  }
}

document.getElementById("randomOsuMap").addEventListener("click", async function (e) {
  e.preventDefault();
  let recursions = randomMapQuantity.value;
  mapInfo.style.display = "flex";
  mapInfo.textContent = `Searching for ${randomMapQuantity.value} maps...`;
  console.log(recursions);
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Automatically stopped after 10 seconds..."));
    }, 10000);
  });

  try {
    await Promise.race([searchForMap(), timeout]);
  } catch (error) {
    console.log(error.message);
  }

  async function searchForMap() {
    while (recursions > 0) {
      const randomNumber = getRandomNumber();
      const url = `https://osu.ppy.sh/beatmapsets/${randomNumber}`;
      console.log(`Checking ${url}...`);
      const exists = await checkLinkExists(url);
      if (exists) {
        let link = document.createElement("a");
        link.href = url;
        link.textContent = url;
        link.style.color = "blue";
        link.target = "_blank";
        mapInfo.appendChild(link);
        recursions -= 1;
      } else {
        console.log("failed to find map");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    console.log("success");
  }
});
