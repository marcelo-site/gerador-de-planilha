const fontsize = document.querySelector("#font-size");
const negrito = document.querySelector("#negrito");
const textAlign = document.querySelector("select");
const number = document.querySelector("#number");
const sum = document.querySelector("#sum");
const linhas = document.querySelector("#linhas");
const size = document.querySelector("#size");

import { tdIndex, tdInput, td, colspan, showConfirm } from "./index.js";

const estilos = () => {
  function stylechange(style, value) {
    if (tdIndex >= 0) tdInput[tdIndex].style[style] = value;
  }

  size.addEventListener("change", (el) => {;
    td[tdIndex].style.width = el.target.value + "px";
  });

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

  textAlign.addEventListener("change", (el) =>
    stylechange("textAlign", el.target.options[el.target.selectedIndex].value)
  );
};

function setStyleInfo(element) {
  fontsize.value = element?.style?.fontSize.replace("px", "") || 16;
  element.classList.contains("number")
    ? (number.checked = true)
    : (number.checked = false);
  element.classList.contains("sum")
    ? (sum.checked = true)
    : (sum.checked = false);
}

// toogle aside
const main = document.querySelector("main");
const asideBefore = document.querySelector("span.arrow");
const aside = document.querySelector("aside");
let showAside = false;
asideBefore.addEventListener("click", (el, fn) => {
  showAside = !showAside;
  if (showAside) {
    aside.style.transform = "translateX(280px)";
    main.style.width = "calc(100vw - 20px)";
    el.target.style.right = "0";
    el.target.style.transform = "rotateY(0deg)";
  } else {
    aside.style.transform = "translateX(0px)";
    main.style.width = "";
    el.target.style.right = "276px";
    el.target.style.transform = "rotateY(180deg)";
  }
});

document
  .querySelector("#empty")
  .addEventListener("click", () =>
    showConfirm("Se não tiver um modelo salvo esta ação irá zerar tudo!", () => window.location.reload())
  );

export { estilos, textAlign, setStyleInfo };
