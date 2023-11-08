const colTable = document.querySelectorAll("#colTable span");
const tbody = document.querySelector("tbody");
const colspan = document.querySelector("#colspan");
let tr = document.querySelectorAll("tr");
let td = document.querySelectorAll("td");
let tdInput = document.querySelectorAll("td input");
const duplicarBloco = document.querySelector("#blocoplus");
const duplicarLinha = document.querySelector("#linhaplus");
const delBlock = document.querySelector("#del-block");
const delRow = document.querySelector("#del-row");
let numbers = document.querySelectorAll(".number");
const copy = document.querySelector("#copy");
const paste = document.querySelector("#paste");
const div = document.querySelector("#div");
const dialog = document.querySelector("#dialog");
const closeDialog = document.querySelector("#dialog #cancel");
const okDialog = document.querySelector("#dialog [data-ok]");
const inputDialog = document.querySelector("#dialog input");
const back = document.querySelector("#background");
const body = document.querySelector("body");

import { estilos, textAlign, setStyleInfo } from "./estilos.js";
estilos();

let tdIndex = -1;
let indexRow = -1;

function sumValue() {
  const sumTd = document.querySelector(".sum");
  if (sumTd) {
    numbers = document.querySelectorAll(".number");
    if (numbers.length > 0) {
      const arr = Array.from(numbers).map((num) => {
        const value = parseFloat(num.value.replace(".", "").replace(",", "."));
        return value;
      });
      const value = arr.reduce((acc, cur) => parseFloat(cur) + acc, 0);
      sumTd.value = value.toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      if (sumTd.value === "NaN") sumTd.value = "soma";
    } else {
      sumTd.value = "soma";
    }
  }
}

colTable[0].addEventListener("click", (el) => {
  dialog.style.display = "";
  body.style.overflow = "hidden";
  back.style.display = "";
});

okDialog.addEventListener("click", () => {
  dialog.style.display = "none";
  body.style.overflow = "";
  back.style.display = "none";
  const tr = document.querySelectorAll("tr");
  tr.forEach((row) => {
    const td = document.createElement("td");
    td.colSpan = 1;
    td.rowSpan = 1;
    td.style.width = inputDialog.value + "px";

    const input = document.createElement("input");
    input.type = "text";
    input.style.textAlign = "center";
    input.spellcheck = false;
    td.append(input);
    row.appendChild(td);
  });
  inputDialog.value = 50;
  tdEventListener();
});

function confirmdelColunm() {
  const tr = document.querySelectorAll("tr");
  if (tr[0].querySelectorAll("td").length > 1) {
    tr.forEach((row) => row.removeChild(row.lastChild));
    td = document.querySelectorAll("td");
  }
}

colTable[1].addEventListener("click", (el) => {
  const length = document.querySelectorAll("td").length;
  if (length > 1) {
    showConfirm("Deseja deletar uma coluna?", confirmdelColunm, true);
  } else showModal("Essa é a ultima coluna!");
  tdEventListener();
});
closeDialog.addEventListener("click", () => {
  dialog.style.display = "none";
  body.style.overflow = "";
  back.style.display = "none";
});

function tdEventListener() {
  tr = document.querySelectorAll("tr");
  tr.forEach((el, i) => el.addEventListener("click", (el) => (indexRow = i)));
  td = document.querySelectorAll("td");
  numbers = document.querySelectorAll(".number");
  tdInput = document.querySelectorAll("td input");

  tdInput.forEach((element, i) => {
    element.addEventListener("focus", () => {
      div.value = "";
      setStyleInfo(element);
      const align = tdInput[i]?.style?.textAlign;
      textAlign.value = align.replace(" ", "");

      tdIndex = i;
      colspan.value = td[i].getAttribute("colspan") || 1;
      linhas.value = td[i].getAttribute("rowspan") || 1;
      td.forEach((e) => (e.style.backgroundColor = ""));

      tdInput[i]?.style?.fontWeight === "bold"
        ? (negrito.checked = true)
        : (negrito.checked = false);
      const width = td[i]?.style?.width;
      size.value = width.replace(" ", "").replace("px", "");
      element.addEventListener("change", () => {
        sumValue();
        division();
      });
    });
  });
}
tdEventListener();

const msg = document.querySelector("#message");
let styleTd = "";
let styleInput = "";
let tdCol = 1;
let tdRow = 1;

function copyStyle() {
  td = document.querySelectorAll("td");
  if (tdIndex >= 0) {
    tdCol = td[tdIndex].getAttribute("colspan");
    tdRow = td[tdIndex].getAttribute("rowspan");
    styleTd = td[tdIndex].getAttribute("style");
    styleInput = tdInput[tdIndex].getAttribute("style");
    msg.innerHTML = "Esltilo copiado!";
    msg.style.display = "";
    setTimeout(() => (copy.checked = false), 600);
    setTimeout(() => (msg.style.display = "none"), 3 * 1000);
  } else {
    showModal("Não há objeto selecionado!");
    copy.checked = false;
  }
}
copy.addEventListener("change", copyStyle);

function pasteStyle() {
  td = document.querySelectorAll("td");
  if (td.length < 2) {
    showModal("Não há objeto suficiente!");
    paste.checked = false;
    return;
  }
  if (tdIndex >= 0) {
    td[tdIndex].setAttribute("colspan", tdCol);
    td[tdIndex].setAttribute("rowspan", tdRow);
    td[tdIndex].style = styleTd;
    tdInput[tdIndex].style = styleInput;
    msg.innerHTML = "Esltilo colado aqui!";
    msg.style.display = "";
    setTimeout(() => (paste.checked = false), 600);
    setTimeout(() => (msg.style.display = "none"), 3 * 1000);
  } else {
    showModal("Não há objeto selecionado!");
    paste.checked = false;
  }
}
paste.addEventListener("change", pasteStyle);

// action
duplicarBloco.addEventListener("click", () => {
  if (tdIndex >= 0) {
    const data = td[tdIndex];
    tdInput.forEach((el) => (el.style.backgroundColor = ""));
    data.insertAdjacentHTML("afterend", data.outerHTML);

    td = document.querySelectorAll("td");
    tdEventListener();
  } else {
    showModal("Não há bloco selecionado!");
  }
});

duplicarLinha.addEventListener("click", () => {
  if (tdIndex >= 0) {
    const data = td[tdIndex].parentNode;
    data
      .querySelectorAll("td")
      .forEach((el) => (el.style.backgroundColor = ""));
    data.insertAdjacentHTML("afterend", data.outerHTML);
  }
  tdEventListener();
});

function confirmDelBlock() {
  td[tdIndex].parentNode.removeChild(td[tdIndex]);
  tdIndex = -1;
}

delBlock.addEventListener("click", async () => {
  if (tdIndex >= 0) {
    td[tdIndex].style.backgroundColor = "red";
    await new Promise((resolve) => setTimeout(resolve, 600));
    showConfirm("Tem certeza que deseja deletar este bloco?", confirmDelBlock);
    td[tdIndex].style.backgroundColor = "";
  } else {
    showModal("Selecione algum bloco!");
  }
});
tr.forEach((el, i) => el.addEventListener("click", (el) => (indexRow = i)));

function confirmDelRow() {
  tbody.removeChild(tr[indexRow]);
  indexRow = -1;
}
delRow.addEventListener("click", async () => {
  tr = document.querySelectorAll("tr");
  if (indexRow >= 0 && tr.length > 1) {
    tr[indexRow].style.backgroundColor = "red";
    await new Promise((resolve) => setTimeout(resolve, 600));
    showConfirm("Tem certeza que deseja deletar esta linha?", confirmDelRow);
  } else if (indexRow < 0) {
    showModal("Selecione algum linha!");
  } else if (tr.length === 1) {
    showModal("Só há uma linha!");
  }
});

function toNumber(el, className) {
  if (tdIndex >= 0) {
    if (el.target.checked) tdInput[tdIndex].setAttribute("class", className);
    else tdInput[tdIndex].setAttribute("class", "");
  }
}

const replaceInput = (el, bool) => {
  function replace() {
    this.value = this.value.replace(/[^0-9.|,]/g, "").replace(/(\*?)\*/g, "$1");
  }
  if (bool) {
    el.addEventListener("input", replace);
  } else {
    el.removeEventListener("input", replace);
  }
};

async function setFuncBlock(el, param, check) {
  if (el.target.checked) {
    let exists = null;
    if (!!tdInput[tdIndex].getAttribute("data-div")) {
      showModal("Esse bloco já é usado para divisão!");
      el.checked = false;
      return;
    } else exists = document.querySelector(".sum");

    if ((!exists && param === "sum") || param !== "sum") {
      toNumber(el, param);
      numbers = document.querySelectorAll("." + param);
      numbers.forEach((element) => replaceInput(element, true));
      el.target.checked = true;
      check.checked = false;
    } else {
      showModal("Outro bloco já éstá sendo usado para soma!");
      el.target.checked = false;
      return;
    }
  } else {
    tdInput[tdIndex].setAttribute("class", "");
  }
  sumValue();
  division();
}

number.addEventListener("change", function (el) {
  if (tdIndex >= 0) {
    setFuncBlock(el, "number", sum);
  } else {
    showModal("Não há objeto selecionado!");
    el.target.checked = false;
  }
});

sum.addEventListener("change", (el) => {
  if (el.target.checked === false) {
    const sum = document.querySelector(".sum");
    if (sum) {
      sum.setAttribute("class", "");
      sum.value = "";
    }
    return;
  }
  if (tdIndex >= 0) {
    if (!el.target.classList.contains("sum")) setFuncBlock(el, "sum", number);
    else showModal("Outro bloco já está sendo usado para soma!");
  } else {
    showModal("Não ha objeto selecionado!");
    el.target.checked = false;
  }
});

function confirmCheckFasle() {
  sum.checked = false;
  number.checked = false;
  tdInput[tdIndex].setAttribute("class", "div");
  tdInput[tdIndex].setAttribute("data-div", div.value);
  const divs = document.querySelectorAll(".div");

  const sumTd = document.querySelector(".sum");
  if (sumTd) {
    sumValue();
    const sumTdValue = sumTd.value.replace(",", ".");
    divs.forEach((el) => {
      const valueData =
        (parseFloat(sumTdValue) * parseInt(el.getAttribute("data-div"))) / 100;
      const value = valueData
        ? valueData.toLocaleString("pt-br", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })
        : "divisão " + el.getAttribute("data-div");
      el.value = value;
    });
  } else {
    divs.forEach((el) => {
      el.value = "divisão " + el.getAttribute("data-div");
    });
  }
}

function division(param, parm2) {
  const sumTd = document.querySelector(".sum");
  if (parm2) {
    const func = tdInput[tdIndex].getAttribute("class");
    if (parm2 !== func) {
      if (!!func) {
        let v = "";
        if (func === "number") v = "numero";
        else if (func === "sum") v = "soma";
        showConfirm(
          "Deseja mudar de " + v + " para divisão?",
          confirmCheckFasle
        );
        return;
      }
    }
    if (parm2 === "div") {
      tdInput[tdIndex].setAttribute("class", "div");
      tdInput[tdIndex].setAttribute("data-div", param.value);
    }
  }
  const valuesum = sumTd?.value.replace(".", "").replace(",", ".");
  const divisions = document.querySelectorAll(".div");
  divisions.forEach((el) => {
    const percent = parseInt(el.getAttribute("data-div")) / 100;
    const value = parseFloat(valuesum) * percent;
    el.value = value.toLocaleString("pt-br", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (el.value === "NaN") el.value = "divisão " + el.getAttribute("data-div");
  });
}

function confirmNoneDivision() {
  tdInput[tdIndex].setAttribute("data-div", "");
  tdInput[tdIndex].setAttribute("class", "");
  tdInput[tdIndex].value = "";
  div.value = "";
}

div.addEventListener("change", (el) => {
  if (tdIndex >= 0) {
    if (parseInt(el.target.value) === 0) {
      showConfirm("Esse bloco será desativado a divisão?", confirmNoneDivision);
      return;
    } else {
      sumValue();
      division(el.target, "div");
      const div = document.querySelectorAll(".div");
      div.forEach((e) => {
        e.addEventListener("click", () => {
          el.target.value = e.getAttribute("data-div");
        });
      });
    }
  } else showModal("Não há elemento selecionado!");
});

function exitModalBackground() {
  body.style.overflow = "";
  dialog.style.display = "none";
  modalConfirm.style.display = "none";
  modalMsg.style.display = "none";
  okConfirm.checked = false;
  back.style.display = "none";
}

const modalMsg = document.querySelector("#modal-msg");
function showModal(msg) {
  body.style.overflow = "hidden";
  const msgDiv = modalMsg.querySelector("[data-msg]");
  msgDiv.innerHTML = msg;
  const ok = modalMsg.querySelector("[data-ok]");
  ok.addEventListener("click", exitModalBackground);
  back.style.display = "";
  modalMsg.style.display = "";
}

// confirm delete coluna elementos
const modalConfirm = document.querySelector("#modal-confirm");
const okConfirm = modalConfirm.querySelector("[data-ok]");
// check botao
let clickDelColumn = false;
let fn = null;

function showConfirm(msg, param, param2) {
  body.style.overflow = "hidden";
  const msgDiv = modalConfirm.querySelector("[data-msg]");
  msgDiv.innerHTML = msg;
  fn = param;
  okConfirm.addEventListener("change", (el) => {
    if (el.target.checked === true) {
      exitModalBackground();
      fn();
      el.target.checked = false;
    }
  });
  if (!clickDelColumn && param2) {
    okConfirm.click();
    msgDiv.innerHTML = msg;
    clickDelColumn = true;
  }
  const cancel = document.querySelector("[data-cancel]");
  cancel.addEventListener("click", () => {
    const tdCurrent = tdInput[tdIndex];
    tdCurrent.focus();
    if (tdCurrent.classList.contains("div")) {
      div.value = tdCurrent.getAttribute("data-div");
    }
    exitModalBackground();
  });
  back.style.display = "";
  modalConfirm.style.display = "";
  okConfirm.checked = false;
  return;
}

back.addEventListener("click", exitModalBackground);

export { tdIndex, tdInput, td, colspan, showConfirm };
