const {
  app,
  BrowserWindow,
  Menu,
  dialog,
  // ipcMain,
  shell,
  // webContents,
} = require("electron");
const fs = require("fs");
const path = require("path");

// Janela principal
let mainWindow = null;
const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  await mainWindow.loadFile("src/index.html");
};

const savePDF = async () => {
  try {
    const title = await mainWindow.webContents.executeJavaScript(
      "document.querySelector('#title').value"
    );
    const path = !!title ? title.replace(/\s/g, "-") : "Planilha";
    const pathEnd = pathDate(path, "pdf");
    let dialogFile = await dialog.showSaveDialog({
      title: "Salvando PDF",
      buttonLabel: "Salvar PDF",
      defaultPath: pathEnd,
    });
    if (dialogFile.canceled) {
      return false;
    }
    const existsExtension = dialogFile.filePath.split(".");
    if (existsExtension.length !== 2) {
      dialogFile.filePath = dialogFile.filePath + ".pdf";
    }
    const pdf = await mainWindow.webContents.printToPDF({
      // margins: ['100', '0', '0', '0'],
      printBackground: true,
    });
    fs.writeFile(dialogFile.filePath, pdf, (error) => {
      if (error) throw error;
    });
  } catch (error) {
    console.log(error);
  }
};

const pathDate = (paramName, paramExtension) => {
  const date = new Date();
  const pathDateAdd = date.toLocaleDateString("pt-br").replace(/\//g, "-");
  return `/${paramName}-${pathDateAdd}.${paramExtension}`;
};

//template menu
const templateMenu = [
  {
    label: "Salvar",
    submenu: [
      {
        label: "Salvar PDF da planilha",
        accelerator: "CmdOrCtrl+shift+P",
        click() {
          savePDF();
        },
      },
    ],
  },
  {
    label: "Vizualizar",
    submenu: [
      {
        label: "zoom +",
        role: "zoomin",
      },
      {
        label: "zoom -",
        role: "zoomout",
      },
      {
        label: "Tamanho padrão",
        role: "resetzoom",
      },
      {
        label: "Alternar tela cheia",
        role: "togglefullscreen",
      },
      {
        label: "Fechar app",
        role: process.platform === "darwin" ? "close" : "quit",
        accelerator: "CmdOrCtrl+Shift+X",
      },
    ],
  },
  {
    label: "Ajuda",
    submenu: [
      {
        label: "Facebook",
        click() {
          shell.openExternal(
            "https://www.facebook.com/profile.php?id=100015225941991"
          );
        },
      },
      {
        label: "Instagram",
        click() {
          shell.openExternal("https://www.instagram.com/marcelosouza5224/");
        },
      },
    ],
  },
  {
    label: "Autor",
    submenu: [
      {
        label: "Marcelo-Site",

        click() {
          shell.openExternal("https://marcelo-site.github.io/portifolio/");
        },
      },
      {
        label: "Marcelo-Facebook",
        click() {
          shell.openExternal(
            "https://www.facebook.com/profile.php?id=100015225941991"
          );
        },
      },
      {
        label: "Marcelo-Instagram",
        click() {
          shell.openExternal("https://www.instagram.com/marcelosouza5224/");
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);
app.whenReady().then(createWindow);

//activate
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
