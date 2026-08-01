// ELEMENT by Lilly — generateur de QR code (100% local, aucune donnee envoyee a un serveur)

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#qr-url");
  const renderBox = document.querySelector("#qr-render");
  const swatches = document.querySelectorAll(".swatch");
  const downloadPng = document.querySelector("#qr-download-png");
  const downloadSvg = document.querySelector("#qr-download-svg");
  if (!input || !renderBox || !window.QRCode) return;

  let color = "#3A342C";
  let lastSvg = "";

  function render(){
    const value = (input.value || input.getAttribute("placeholder") || "https://elementbylilly.fr").trim();
    window.QRCode.toString(value, { type: "svg", errorCorrectionLevel: "M", margin: 1, color: { dark: color, light: "#FFFFFF" } }, (err, svg) => {
      if (err) return;
      lastSvg = svg;
      renderBox.innerHTML = svg;
    });
  }

  swatches.forEach(sw => {
    sw.addEventListener("click", () => {
      swatches.forEach(s => s.classList.remove("active"));
      sw.classList.add("active");
      color = sw.getAttribute("data-color");
      render();
    });
  });

  input.addEventListener("input", render);
  document.addEventListener("langchange", render);
  render();

  downloadSvg.addEventListener("click", () => {
    const blob = new Blob([lastSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "qrcode-element-by-lilly.svg";
    a.click();
    URL.revokeObjectURL(url);
  });

  downloadPng.addEventListener("click", () => {
    const value = (input.value || input.getAttribute("placeholder") || "https://elementbylilly.fr").trim();
    window.QRCode.toDataURL(value, { type: "image/png", width: 1024, margin: 2, errorCorrectionLevel: "M", color: { dark: color, light: "#FFFFFF" } }, (err, dataUrl) => {
      if (err) return;
      const a = document.createElement("a");
      a.href = dataUrl; a.download = "qrcode-element-by-lilly.png";
      a.click();
    });
  });
});
