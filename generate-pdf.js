// gerar pdf
const generetePDF = document.querySelector("#pdf");
generetePDF.addEventListener("click", () => {
  const content = document.querySelector("table");
  const date = Date.now();
  const options = {
    margin: 1,
    filename: `${date}-planilha.pdf`,
    html2canvas: { sacle: 1 },
    pagebreak: { avoid: "tr" },
    image: { type: "jpeg", quality: 0.98 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(options).from(content).save();
});