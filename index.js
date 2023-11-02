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

let deleteblockTrue = false;
let tdIndex = -1;

function tdEventListener() {
  td.forEach((el, i) => {
    el.addEventListener("click", () => {
      td.forEach((e) => (e.style.backgroundColor = ""));
      tdIndex = i;
      colspan.value = el.getAttribute("colspan") || 1;
      linhas.value = el.getAttribute("rowspan") || 1;
      td.forEach((e) => (e.style.backgroundColor = ""));
      el.style.backgroundColor = "#ddddddbe";
      tdInput[i]?.style?.fontWeight === "bold"
        ? (negrito.checked = true)
        : (negrito.checked = false);
      size.value = el.clientWidth;
    });
    tdInput = document.querySelectorAll("td input");
    if (tdInput.length > 1) {
      deleteblockTrue = true;
    } else {
      deleteblockTrue = false;
    }

    tdInput.forEach((el, i) => {
      el.addEventListener("focus", () => {
        fontsize.value = el?.style?.fontSize.replace("px", "") || 16;
        el.classList.contains("number")
          ? (number.checked = true)
          : (number.checked = false);
        el.classList.contains("sum")
          ? (sum.checked = true)
          : (sum.checked = false);

        const node = el.getAttribute("style");
        if(node) {
          const arr = node.split(";");
          const value = arr.filter((el) => {
            const textAlign = el.split(":");
            if (textAlign[0] === "text-align") {
              alinharText.value = textAlign[1].replace(" ", "");
              return;
            }
          });
        } else {
          alinharText.value = 'center';
        }
      },
      el.addEventListener('change', () => {
        sumValue()
      }));
    });
  });
}
tdEventListener();

size.addEventListener("change", (el) => {
  console.log(td[tdIndex]);
  if (tdIndex >= 0) {
    console.log(77);
    td[tdIndex].style.width = `${el.target.value}px`;
  }
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
      const res = confirm("Deseja deletar um bloco");
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
      const value = arr.reduce((acc, cur) => cur + acc, 0);
      sum.value = value.toLocaleString("pt-br", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }
}

number.addEventListener("change", (el) => {
  if (!tdInput[tdIndex].classList.contains("sum")) {
    toNumber(el, "number");
    numbers = document.querySelectorAll(".number");
    numbers.forEach((num) => replaceInput(num));
  } else {
    alert("O bloco já é usaddo para guardar número");
    el.target.checked = false;
  }
  sumValue();
});

let sumExists = false;

sum.addEventListener("change", (el) => {
  const exists = document.querySelector(".sum");
  if (exists) {
    const res = confirm("Outro bloco já está guardando a soma, deseja mudar?");
    if (res === true) return;
  }
  if (tdInput[tdIndex].classList.contains("number")) {
    const res = confirm(
      "Esse bloco já é usado para guardar número, deseja mudar?"
    );
    if (res === false) {
      el.target.checked = false;
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
