const { app, BrowserWindow, Menu, dialog, shell } = require("electron");
const fs = require("fs");

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
  mainWindow.webContents.openDevTools();
  await mainWindow.loadFile("src/index.html");
};

const messageBox = async (message, detail, img, buttons) => {
  return await dialog.showMessageBox({
    title: "Atenção!",
    message: message,
    detail: detail || "Algum erro não indentificado aconteceu!",
    icon: img,
    buttons: buttons,
  });
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
      printBackground: true,
    });
    fs.writeFile(dialogFile.filePath, pdf, (error) => {
      if (error) throw error;
    });
  } catch (error) {
    const msg = "Ops! algum erro aconteceu!";
    const detail = error?.code ? null : error.message;
    const img = "./src/img/warning.png";
    const buttons = ["ok"];
    messageBox(msg, detail, img, buttons);
  }
};

const pathDate = (paramName, paramExtension) => {
  const date = new Date();
  const pathDateAdd = date.toLocaleDateString("pt-br").replace(/\//g, "-");
  return `/${paramName}-${pathDateAdd}.${paramExtension}`;
};

// salvar no disco
const saveFileAs = async (extension) => {
  try {
    const title = await mainWindow.webContents.executeJavaScript(
      "document.querySelector('#title').value"
    );
    const file = title ? title.replace(/\s/g, "-") + extension : "modelo" + extension;
    let dialogFile = await dialog.showSaveDialog({
      title: "Exportando Modelo",
      buttonLabel: "Exportar Modelo",
      defaultPath: file,
    });
    if (dialogFile.canceled) {
      return false;
    }
    const existsExtension = dialogFile.filePath.split(".");
    if (existsExtension.length !== 2) {
      dialogFile.filePath = dialogFile.filePath + extension;
    }
    const content = await mainWindow.webContents.executeJavaScript(
      'localStorage.getItem("model");',
      true
    );
    if (!content) throw new Error("Talvez você não tenha modelo Salvo!");
    // salvar
    fs.writeFile(dialogFile.filePath, content, (error) => {
      if (error) throw error;
    });
  } catch (error) {
    const msg = "Ops! algum erro aconteceu!";
    const detail = error?.code ? "Algo inesperado aconteceu!" : error.message;
    const img = "./src/img/warning.png";
    const buttons = ["ok"];
    messageBox(msg, detail, img, buttons);
  }
};

// importar arquivo
const openFile = async () => {
  try {
    let dialogFile = await dialog.showOpenDialog({
      title: "Procurando Modelo",
      buttonLabel: "Importar Modelo",
      message: "mensagem",
      properties: ["openFile"],
      filters: [
        {
          name: "All",
          extensions: ["*"],
        },
        {
          name: "Arquivos .extension",
          extensions: ["txt"],
        },
      ],
    });
    if (dialogFile.canceled) {
      return false;
    }
    const msg = "Tem certeza que deseja atualizar o  modelo?";
    const detail =
      "Se continuar vai subistituir todos na tela pelo do arquivo escolhido.";
    const img = "./src/img/warning.png";
    const buttons = ["ok", "cancel"];
    const res = await messageBox(msg, detail, img, buttons);

    if (res.response === 0) {
      const content = fs.readFileSync(dialogFile.filePaths[0], "utf-8");
      // salvar no frontend
      mainWindow.webContents.send("update-model", content);
    }
  } catch (error) {
    const msg = "Ops! algum erro aconteceu!";
    const detail = error?.code ? null : error.message;
    const img = "./src/img/warning.png";
    const buttons = ["ok"];
    messageBox(msg, detail, img, buttons);
  }
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
      {
        label: "Exportar Modelo",
        accelerator: "CmdOrCtrl+shift+s",
        click() {
          saveFileAs(".txt");
        },
      },
      {
        label: "Importar Modelo",
        accelerator: "CmdOrCtrl+shift+A",
        click() {
          openFile();
        },
      },
    ],
  },
  {
    label: "Vizualizar",
    submenu: [
      {
        label: "Zoom +",
        role: "zoomin",
      },
      {
        label: "Zoom -",
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
        accelerator: "CmdOrCtrl+Shift+Q",
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
