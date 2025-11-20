// ...existing code...
async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput) {
        alert("File input not found.");
        return;
    }

    const file = fileInput.files && fileInput.files[0];
    if (!file) {
        alert("Please select a file first!");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // CHANGE THIS URL TO THE NGROK URL PROVIDED BY COLAB
    const backendURL =  "https://reverse-thesis-outputs-beaver.trycloudflare.com" + "/process";


    const loadingEl = document.getElementById("loading");
    if (loadingEl) loadingEl.classList.remove("hidden");

    try {
        const res = await fetch(backendURL, {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Server returned ${res.status} ${res.statusText}: ${text}`);
        }

        const data = await res.json();

        const captionEl = document.getElementById("captionText");
        if (captionEl) captionEl.innerText = data.caption || "";

        const preview = document.getElementById("previewImage");
        if (preview) {
            preview.src = data.output ? "data:image/jpeg;base64," + data.output : "";
        }
    } catch (err) {
        alert("Error: " + (err.message || err));
        console.error(err);
    } finally {
        if (loadingEl) loadingEl.classList.add("hidden");
    }
}
// ...existing code...