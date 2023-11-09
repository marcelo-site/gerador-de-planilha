const { ipcRenderer } = require("electron");
ipcRenderer.on("update-model", (e, data) => {
  localStorage.setItem("model", data);
  setTimeout(() => location.reload(), 500);
});

const tableModel = localStorage.getItem("model");
const table = document.querySelector("table");

const setModal = () => {
  if (tableModel) {
    const model = JSON.parse(tableModel);
    if (typeof model === "object") {
      document.querySelector("#title").value = model.title;
      model.data.map((el) => {
        const tr = document.createElement("tr");
        el.map((e) => {
          const td = document.createElement("td");
          td.setAttribute("colspan", e.colspan || 1);
          td.setAttribute("rowspan", e.rowspan || 1);
          td.style.width = e?.width ? e.width : 50;
          const input = document.createElement("input");
          input.type = "text";
          input.value = e.value;
          input.spellcheck = "false";
          input.style = e.style;
          input.setAttribute("class", e.className);
          if (e?.div) input.setAttribute("data-div", e.div);
          td.append(input);
          tr.append(td);
        });
        table.querySelector("tbody").append(tr);
      });
    }
  } else {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.setAttribute("colspan", "1");
    td.setAttribute("rowspan", "1");
    td.style.width = "50px";
    const input = document.createElement("input");
    input.type = "text";
    input.spellcheck = "false";
    input.style.textAlign = "center";
    td.append(input);
    tr.append(td);
    table.querySelector("tbody").append(tr);
  }
};
setModal();

const saveModel = () => {
  const trs = document.querySelectorAll("tr");
  const all = Array.from(trs).map((tr) => {
    const tds = tr.querySelectorAll("td");
    const arrTd = Array.from(tds).map((td) => {
      const input = td.querySelector("input");
      const obj = {
        value: input.value || "",
        width: td?.style?.width || "50",
        className: input.getAttribute("class") || "",
        style: input.getAttribute("style") || "",
        colspan: td.getAttribute("colspan") || 1,
        rowspan: td.getAttribute("rowspan") || 1,
      };
      if (input.getAttribute("data-div"))
        obj.div = input.getAttribute("data-div");
      return obj;
    });
    return arrTd;
  });
  const title = document.querySelector('#title').value
  localStorage.setItem("model", JSON.stringify({ title: title, data: all }));
  const msg = document.querySelector("#message");
  msg.innerHTML = "Você acaba de salvar este modelo!";
  msg.style.display = "";
  msg.style.transform = "translateX(-40vw)";

  setTimeout(() => {
    msg.style.display = "none";
    msg.style.transform = "translateX(0)";
  }, 3 * 1000);
};
