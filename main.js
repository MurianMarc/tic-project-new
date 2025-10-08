

// for uploading
document.getElementById("my-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("upload");
  const desc = document.getElementById("desc").value.trim();

  if (!fileInput.files.length) {
    alert("Please upload an image first.");
    return;
  }

  const file = fileInput.files[0];
  const base64 = await toBase64(file);

  try {
    // omo
    const lostItems = JSON.parse(localStorage.getItem("lostItems") || "[]");
    lostItems.push({ image: base64, description: desc });
    localStorage.setItem("lostItems", JSON.stringify(lostItems));

    alert("Image uploaded successfully!");
  } catch (err) {
    console.error("Upload failed:", err);
    alert("Failed to upload image.");
  }
});



document.querySelector(".search button")?.addEventListener("click", async () => {
  const query = document.querySelector(".search input").value.trim();
  if (!query) {
    alert("Please enter a description to search.");
    return;
  }

  const lostItems = JSON.parse(localStorage.getItem("lostItems") || "[]");

  if (lostItems.length === 0) {
    alert("No lost items available for searching.");
    return;
  }

  try {
    // something about sending the images to the api
    const descriptions = lostItems.map((item, i) => `Item ${i + 1}: ${item.description}`).join("\n");

    const response = await fetch("http://localhost:5000/ai-search", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  
});

    const data = await response.json();
   const result = data.result?.trim() || "";


    console.log("AI Match Result:", result);

    const matchIndex = parseInt(result.match(/\d+/)?.[0]) - 1;

    if (!isNaN(matchIndex) && lostItems[matchIndex]) {
      showResult(lostItems[matchIndex]);
    } else {
      alert("No matching item found.");
    }

  } catch (error) {
    console.error("Search failed:", error);
    alert("Error searching items. Check console for details.");
  }
});




//omo, i cant even explain this one
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
  });
}

function showResult(item) {
  let resultBox = document.getElementById("search-result");
  if (!resultBox) {
    resultBox = document.createElement("div");
    resultBox.id = "search-result";
    document.body.appendChild(resultBox);
  }

  resultBox.innerHTML = `
    <h3>Best Match Found:</h3>
    <p>${item.description}</p>
    <img src="data:image/jpeg;base64,${item.image}" width="250" style="border-radius: 10px;">
  `;
  
}
