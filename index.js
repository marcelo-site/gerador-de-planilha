const main = document.querySelector("main");
const table = document.querySelector("table");
const tr = document.querySelectorAll("tr");
const colspan = document.querySelector("#colspan");
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
const alinharText = document.querySelector("select");
const copy = document.querySelector("#copy")
const paste = document.querySelector("#paste")

let deleteblockTrue = false;
let tdIndex = -1;

function getStyle(el) {
  const node = el.getAttribute("style");
  if (node) {
    const arr = node.split(";");
    const value = arr.filter((element) => {
      const width = element.split(":");
      if (width[0] === "width") {
        size.value = width[1].replace(" ", "").replace("px", "");
        return;
      }
    });
    if (!value) size.value = el.clientWidth;
  } else {
    size.value = el.clientWidth;
  }
}

function tdEventListener() {
  td.forEach((el, i) => {
    el.addEventListener("click", () => {
      td.forEach((e) => (e.style.backgroundColor = ""));
      tdIndex = i;
      colspan.value = el.getAttribute("colspan") || 1;
      linhas.value = el.getAttribute("rowspan") || 1;
      td.forEach((e) => (e.style.backgroundColor = ""));
      tdInput[i]?.style?.fontWeight === "bold"
        ? (negrito.checked = true)
        : (negrito.checked = false);

      getStyle(el);
    });

    tdInput = document.querySelectorAll("td input");
    if (tdInput.length > 1) {
      deleteblockTrue = true;
    } else {
      deleteblockTrue = false;
    }

    tdInput.forEach((element, i) => {
      element.addEventListener(
        "focus",
        () => {
          fontsize.value = element?.style?.fontSize.replace("px", "") || 16;
          element.classList.contains("number")
            ? (number.checked = true)
            : (number.checked = false);
          element.classList.contains("sum")
            ? (sum.checked = true)
            : (sum.checked = false);

          getStyle(el);
        },
        el.addEventListener("change", sumValue)
      );
    });
  });
}
tdEventListener();

const msg = document.querySelector('#message')
let styleTd = ''
let styleInput = ''
let tdCol = 1
let tdRow = 1
function copyStyle () {
  if(tdIndex >= 0) {
    tdCol = td[tdIndex].getAttribute('colspan')
    tdRow = td[tdIndex].getAttribute('rowspan')
    styleTd = td[tdIndex].getAttribute("style");
    styleInput = tdInput[tdIndex].getAttribute("style");
    msg.innerHTML = 'Esltilo copiado!'
    msg.style.display = ''
    setTimeout(() => {
      copy.checked = false
      msg.style.display = 'none'
    }, 3 * 1000)
  }
}

copy.addEventListener('change', (el) => {
  if(el.target.checked) copyStyle()
})

function pasteStyle () {
  if(tdIndex >= 0) {
    td[tdIndex].setAttribute('colspan', tdCol)
    td[tdIndex].setAttribute('rowspan', tdRow)
    td[tdIndex].style = styleTd
    tdInput[tdIndex].style = styleInput
    msg.innerHTML = 'Esltilo colado aqui!'
    msg.style.display = ''
    setTimeout(() => {
      paste.checked = false
      msg.style.display = 'none'
    }, 3 * 1000)
  }
}

paste.addEventListener('change', (el) => {
  if(el.target.checked && tdIndex >= 0) pasteStyle()
})

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

alinharText.addEventListener("change", (el) => {
  if (tdIndex >= 0) {
    tdInput[tdIndex].style.textAlign =
      el.target.options[el.target.selectedIndex].value;
  }
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
  td = document.querySelectorAll("td");
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
    }, 500);
  }
});

function toNumber(el, className) {
  if (tdIndex >= 0) {
    if (el.target.checked) tdInput[tdIndex].classList.add(className);
    else tdInput[tdIndex].classList.remove(className);
  }
}

const replaceInput = (el) => {
  el.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9.|,]/g, "").replace(/(\*?)\*/g, "$1");
  });
};

function sumValue() {
  const sum = document.querySelector(".sum");
  if (sum) {
    numbers = document.querySelectorAll(".number");
    if (numbers.length > 0) {
      const arr = [];
      numbers.forEach((num) => {
        const value = parseFloat(num.value.replace(".", "").replace(",", "."));
        arr.push(value);
      });
      const value = arr.reduce((acc, cur) => parseFloat(cur) + acc, 0);
      sum.value = value.toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }
}

number.addEventListener("change", (el) => {
  if (!tdInput[tdIndex]?.classList.contains("sum")) {
    toNumber(el, "number");
    numbers = document.querySelectorAll(".number");
    numbers.forEach((num) => replaceInput(num));
  } else {
    alert("O bloco já é usaddo para guardar soma!");
    el.target.checked = false;
  }
  sumValue();
});

let sumExists = false;
sum.addEventListener("change", (el) => {
  const exists = document.querySelector(".sum");
  if (exists) {
    if (exists === tdInput[tdIndex]) {
      const res = confirm("Deseja desativar a função de soma desse bloco?");
      if (res === true) {
        exists.classList.remove("sum");
        el.target.checked = false;
      } else {
        el.target.checked = true;
        return;
      }
    }
  }
  if (tdInput[tdIndex]?.classList.contains("number")) {
    const res = confirm(
      "Esse bloco já é usado para guardar número, deseja mudar?"
    );
    if (res === false) {
      el.target.checked = false;
      number.checked = true;
      return;
    } else if (res === true) {
      el.target.checked = true;
      number.checked = false;
      exists?.classList.remove("sum");
      tdInput[tdIndex].classList.remove("number");
      tdInput[tdIndex].classList.add("sum");
      return;
    }
  }
  toNumber(el, "sum");
  sumValue();
});

let showAside = false;
asideBefore.addEventListener("click", (el) => {
  showAside = !showAside;
  if (showAside) {
    aside.style.transform = "translateX(5px)";
    main.style.width = "calc(100vw - 20px)";
    el.target.style.right = "0";
    el.target.style.transform = "rotateY(0deg)";
  } else {
    aside.style.transform = "translateX(0px)";
    main.style.width = "";
    el.target.style.right = "255px";
    el.target.style.transform = "rotateY(180deg)";
  }
});

function tirarFoco() {
  td.forEach((el) => {
    el.style.backgroundColor = "";
    tdInput[tdIndex].blur();
  });
}
// gerar pdf
const generetePDF = document.querySelector("#pdf");
generetePDF.addEventListener("click", () => {
  tirarFoco();
  const content = document.querySelector("table");
  const date = new Date().toLocaleDateString("pt-br").replace(/\//g, "-");
  const options = {
    margin: 1,
    filename: `pedido-catalogo-incrivel-${date}.pdf`,
    html2canvas: { sacle: 1 },
    pagebreak: { avoid: "tr" },
    image: { type: "jpeg", quality: 0.98 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(options).from(content).save();
});
