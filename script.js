let selectedFile = null;

// Show the popup menu on click
document.getElementById("add_file").addEventListener("click", () => {
  const popup = document.getElementById("popupMenu");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
});

// Handlers for source selection
function openCamera() {
    document.getElementById("cameraInput").click();
    closePopup();
}
  
function openGallery() {
    document.getElementById("galleryInput").click();
    closePopup();
}
  
function openFile() {
  document.getElementById("fileInput").click();
  closePopup();
}
function closePopup() {
  document.getElementById("popupMenu").style.display = "none";
}

// Handle file selections
const handleFile = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      selectedFile = file;
  
      // Set file name and type
      document.getElementById("fileDetails").innerText = `${file.name} (${file.type})`;
  
      // Show preview
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("filePreview").src = e.target.result;
      };
      reader.readAsDataURL(file);
  
      document.getElementById("fileInfo").style.display = "block";
    } else {
      alert("Please select a valid image file.");
    }
  };
  

// Cancel selected file
document.getElementById("cancelFile").addEventListener("click", () => {
  selectedFile = null;
  document.getElementById("fileInfo").style.display = "none";
});

// Upload image to backend
document.getElementById("uploadButton").addEventListener("click", () => {
  if (!selectedFile) {
    alert("Please select an image first.");
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedFile);

  fetch("http://127.0.0.1:10000/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    alert("Image uploaded successfully!");
    selectedFile = null;
    document.getElementById("fileInfo").style.display = "none";
  })
  .catch(err => {
    console.error("Upload failed:", err);
    alert("Upload failed.");
  });
});

// Bind change events
["cameraInput", "galleryInput", "fileInput"].forEach(id =>
  document.getElementById(id).addEventListener("change", handleFile)
);

// Drag and drop support
const dropZone = document.getElementById("dropArea"); // your upload area div

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragging"); // Optional: for visual feedback
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragging");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragging");

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    const fileEvent = { target: { files: [file] } };
    handleFile(fileEvent); // Reuse your existing file handler
  } else {
    alert("Please drop a valid image file.");
  }
});

