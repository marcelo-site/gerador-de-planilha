const colTable = document.querySelectorAll("#colTable span");
const tbody = document.querySelector("tbody");
const main = document.querySelector("main");
const table = document.querySelector("table");
const colspan = document.querySelector("#colspan");
let tr = document.querySelectorAll("tr");
let td = document.querySelectorAll("td");
let tdInput = document.querySelectorAll("td input");
const fontsize = document.querySelector("#font-size");
const negrito = document.querySelector("#negrito");
const colunas = document.querySelector("#colunas");
const linhas = document.querySelector("#linhas");
const size = document.querySelector("#size");
const duplicarBloco = document.querySelector("#blocoplus");
const duplicarLinha = document.querySelector("#linhaplus");
const delBlock = document.querySelector("#del-block");
const delRow = document.querySelector("#del-row");
const aside = document.querySelector("aside");
const asideBefore = document.querySelector("span.arrow");
const number = document.querySelector("#number");
const sum = document.querySelector("#sum");
let numbers = document.querySelectorAll(".number");
const textAlign = document.querySelector("select");
const copy = document.querySelector("#copy");
const paste = document.querySelector("#paste");
const div = document.querySelector("#div");
const dialog = document.querySelector("dialog");
const closeDialog = document.querySelector("dialog #cancel");
const okDialog = document.querySelector("dialog #ok");
const inputDialog = document.querySelector("dialog input");

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
    }
  }
}

let deleteblockTrue = false;
let tdIndex = -1;
let indexRow = -1;

colTable[0].addEventListener("click", (el) => {
  dialog.showModal();
});

okDialog.addEventListener("click", () => {
  dialog.close();
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

colTable[1].addEventListener("click", (el) => {
  const tr = document.querySelectorAll("tr");
  const length = tr[0].querySelectorAll("td").length;
  if (length === 1) {
    alert("Essa é a ultima coluna!");
  } else {
    const res = confirm("Tem certeza que deseja deletar uma coluna?");
    if (res === true) {
      if (length > 1) {
        tr.forEach((row) => row.removeChild(row.lastChild));
        td = document.querySelectorAll("td");
      }
    }
  }
  tdEventListener();
});
closeDialog.addEventListener("click", () => dialog.close());

function copyPaste(e) {
  if ((e.shiftKey && e.altKey && e.key === "c") || e.key === "C") {
    copyStyle();
  }
  if ((e.shiftKey && e.altKey && e.key === "v") || e.key === "V") {
    pasteStyle();
  }
}

function setStyleInfo(element) {
  fontsize.value = element?.style?.fontSize.replace("px", "") || 16;
  element.classList.contains("number")
    ? (number.checked = true)
    : (number.checked = false);
  element.classList.contains("sum")
    ? (sum.checked = true)
    : (sum.checked = false);
}

function tdEventListener() {
  tr = document.querySelectorAll("tr");
  tr.forEach((el, i) => el.addEventListener("click", (el) => (indexRow = i)));
  td = document.querySelectorAll("td");
  numbers = document.querySelectorAll(".number");
  tdInput = document.querySelectorAll("td input");
  if (tdInput.length > 1) deleteblockTrue = true;
  else deleteblockTrue = false;

  tdInput.forEach((element, i) => {
    element.addEventListener("keydown", copyPaste);

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
    setTimeout(() => {
      copy.checked = false;
      msg.style.display = "none";
    }, 3 * 1000);
  }
}

copy.addEventListener("change", (el) => {
  if (el.target.checked) copyStyle();
});

function pasteStyle() {
  td = document.querySelectorAll("td");
  if (tdIndex >= 0) {
    td[tdIndex].setAttribute("colspan", tdCol);
    td[tdIndex].setAttribute("rowspan", tdRow);
    td[tdIndex].style = styleTd;
    tdInput[tdIndex].style = styleInput;
    msg.innerHTML = "Esltilo colado aqui!";
    msg.style.display = "";
    setTimeout(() => {
      paste.checked = false;
      msg.style.display = "none";
    }, 3 * 1000);
  }
}

paste.addEventListener("change", (el) => {
  if (el.target.checked && tdIndex >= 0) pasteStyle();
});

size.addEventListener("change", (el) => {
  if (tdIndex >= 0) td[tdIndex].style.width = `${el.target.value}px`;
});

function stylechange(style, value) {
  if (tdIndex >= 0) tdInput[tdIndex].style[style] = value;
}

fontsize.addEventListener("change", (el) =>
  stylechange("fontSize", `${el.target.value}px`)
);

negrito.addEventListener("change", (el) => {
  if (el.target.checked) stylechange("fontWeight", "bold");
  else stylechange("fontWeight", "");
});

colspan.addEventListener("change", (el) => {
  if (tdIndex >= 0) td[tdIndex].setAttribute("colspan", el.target.value);
});

linhas.addEventListener("change", (el) => {
  if (tdIndex >= 0) td[tdIndex].setAttribute("rowspan", el.target.value);
});

textAlign.addEventListener("change", (el) => {
  if (tdIndex >= 0)
    tdInput[tdIndex].style.textAlign =
      el.target.options[el.target.selectedIndex].value;
});

// action
duplicarBloco.addEventListener("click", () => {
  if (tdIndex >= 0) {
    const data = td[tdIndex];
    tdInput.forEach((el) => (el.style.backgroundColor = ""));
    data.insertAdjacentHTML("afterend", data.outerHTML);
  }
  td = document.querySelectorAll("td");
  tdEventListener();
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

delBlock.addEventListener("click", () => {
  if (deleteblockTrue) {
    td[tdIndex].style.backgroundColor = "red";
    setTimeout(() => {
      const res = confirm("Deseja deletar um bloco?");
      if (res === true) {
        td[tdIndex].parentNode.removeChild(td[tdIndex]);
      } else {
        td[tdIndex].style.backgroundColor = "";
      }
      tr = document.querySelectorAll("tr");
      tr.forEach((el) => {
        const child = el.querySelector("td");
        if (!child) {
          const parent = el.parentNode;
          parent.removeChild(el);
        }
      });
    }, 500);
  }
});
tr.forEach((el, i) => el.addEventListener("click", (el) => (indexRow = i)));

delRow.addEventListener("click", () => {
  tr = document.querySelectorAll("tr");
  if (indexRow >= 0 && tr.length > 1) {
    tr[indexRow].style.backgroundColor = "red";
    setTimeout(() => {
      const res = confirm("Desja deletar uma linha?");
      if (res === true) {
        tbody.removeChild(tr[indexRow]);
      } else {
        tr[indexRow].style.backgroundColor = "";
      }
    }, 500);
  }
});

function toNumber(el, className) {
  if (tdIndex >= 0) {
    if (el.target.checked) tdInput[tdIndex].classList.add(className);
    else tdInput[tdIndex].classList.remove(className);
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

function setFuncBlock(el, param, check) {
  if (el.target.checked) {
    const exists = tdInput[tdIndex].getAttribute("class");
    tdInput[tdIndex].setAttribute("data-div", "");
    if (!exists) {
      toNumber(el, param);
      numbers = document.querySelectorAll("." + param);
      numbers.forEach((element) => replaceInput(element, true));
    } else {
      const res = confirm(
        "O bloco já é usaddo para guardar soma ou divisão, deseja mudar?"
      );
      if (res === true) {
        tdInput[tdIndex].setAttribute("class", "");
        toNumber(el, param);
        numbers = document.querySelectorAll("." + param);
        numbers.forEach((element) => replaceInput(element, true));
        el.target.checked = true;
        check.checked = false;
      } else {
        el.target.checked = false;
      }
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
    alert("Não há objeto selcionado!");
    el.target.checked = false;
  }
});

sum.addEventListener("change", (el) => {
  if (tdIndex >= 0) {
    setFuncBlock(el, "sum", number);
  } else {
    alert("Não ha objeto selecionado!");
    el.target.checked = false;
  }
});

function division(param, parm2) {
  const sumTd = document.querySelector(".sum");
  let func = tdInput[tdIndex].getAttribute("class");

  if (tdIndex >= 0 && parm2 === "div" && func !== "div") {
    if (!!func) {
      let v = "";
      if (func === "number") v = "numero";
      else if (func === "sum") v = "soma";
      const res = confirm(
        "Deseja mudar esse bloco de " + v + " soma para divisão?"
      );
      if (res === true) {
        tdInput[tdIndex].setAttribute("class", "");
        tdInput[tdIndex].classList.add("div");
        tdInput[tdIndex].setAttribute("data-div", param.value);
        sum.checked = false;
        number.checked = false;
      } 
      // else return;
    }
  }
  const valuesum = sumTd?.value.replace(".", "").replace(",", ".");
  const divisions = document.querySelectorAll(".div");
  divisions.forEach((el) => {
    const perc = parseInt(el.getAttribute("data-div")) / 100;
    const value = parseFloat(valuesum) * perc;
    el.value = value.toLocaleString("pt-br", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (el.value === "NaN") el.value = "divisão " + el.getAttribute("data-div");
  });
}

div.addEventListener("change", (el) => {
  if (tdIndex >= 0) {
    sumValue();
    division(el.target, "div");
    const div = document.querySelectorAll(".div");

    div.forEach((e) => {
      e.addEventListener("click", () => {
        el.target.value = e.getAttribute("data-div");
      });
    });
  } else {
    alert("Não há elemento selecinando!");
  }
});

let showAside = false;
asideBefore.addEventListener("click", (el) => {
  showAside = !showAside;
  if (showAside) {
    aside.style.transform = "translateX(10px)";
    main.style.width = "calc(100vw - 20px)";
    el.target.style.right = "0";
    el.target.style.transform = "rotateY(0deg)";
  } else {
    aside.style.transform = "translateX(0px)";
    main.style.width = "";
    el.target.style.right = "285px";
    el.target.style.transform = "rotateY(180deg)";
  }
});
