const { ipcRenderer } = require("electron");
ipcRenderer.on("update-model", (e, data) => {
  localStorage.setItem("model", data);
  setTimeout(() => location.reload(), 500);
});

const tableModelData = localStorage?.getItem("model");
let tableModel = null;
if (tableModelData) tableModel = JSON.parse(tableModelData);
else localStorage.setItem("model", JSON.stringify([]))
const index = localStorage?.getItem("index");
let modelIndex = -1;
if (index) modelIndex = parseInt(index);
else localStorage.setItem("index", "")
const table = document.querySelector("table");
const models = document.querySelector("#models");

const setModal = () => {
  if (tableModel?.length > 0) {
    tableModel.map((model, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = model.title;
      models.appendChild(opt);
    });
    document.querySelector("select").addEventListener("change", (el) => {
      localStorage.setItem("index", el.target.value);
      setTimeout(() => window.location.reload(), 500);
    });
  }
  if (tableModel?.length > 0 && modelIndex >= 0) {
    document.querySelector("#title").value = tableModel[modelIndex].title;
    tableModel[modelIndex].data.map((el) => {
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

const editModel = () => {
  saveModel(localStorage.getItem("index"));
};

const saveModel = (param) => {
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
  const title = document.querySelector("#title").value || 'Sem Titulo';
  let modelsData = tableModel?.length > 0 ? tableModel : [];

  if (param) {
    modelsData.splice(param, 1, { title: title, data: all });
  } else {
    localStorage.setItem("index", modelsData.length)
    modelsData.push({ title: title, data: all });
  }

  localStorage.setItem("model", JSON.stringify(modelsData));
  const msg = document.querySelector("#message");
  msg.innerHTML = "Você acaba de salvar este modelo!";
  msg.style.display = "";
  msg.style.transform = "translateX(-40vw)";

  setTimeout(() => {
    msg.style.display = "none";
    msg.style.transform = "translateX(0)";
    window.location.reload()
  }, 3 * 1000);
};
