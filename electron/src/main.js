const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const waitOn = require("wait-on");
const fs = require("fs");

let mainWindow;
let springBootProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Allow shared context
      enableRemoteModule: true, // Optional, if you need remote module
      // webSecurity: false // Disable web security for testing purposes
    },
  });

  mainWindow
    .loadURL("http://localhost:8081")
    .then(() => {
      console.log("Loaded URL successfully");
    })
    .catch((error) => {
      console.error("Failed to load URL:", error);
    });

  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on(
    "console-message",
    (event, level, message, line, sourceId) => {
      if (message.includes("Autofill.enable failed")) {
        event.preventDefault();
      }
    }
  );

  mainWindow.on("closed", function () {
    mainWindow = null;
    if (springBootProcess) {
      springBootProcess.kill();
    }
  });
}

app.on("ready", () => {
  console.log("App is ready");
  const jarPath = path.join(
    process.resourcesPath,
    "ping-back-end-1.0-SNAPSHOT.jar"
  );
  console.log(`Starting Spring Boot application from JAR: ${jarPath}`);

  springBootProcess = exec(`java -jar ${jarPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Spring Boot Error: ${error}`);
      return;
    }
    console.log(`Spring Boot: ${stdout}`);
    console.error(`Spring Boot Error: ${stderr}`);
  });

  // Log output and errors to files
  const logStream = fs.createWriteStream("spring-boot-log.txt", { flags: "a" });
  const errorStream = fs.createWriteStream("spring-boot-error.txt", {
    flags: "a",
  });
  springBootProcess.stdout.pipe(logStream);
  springBootProcess.stderr.pipe(errorStream);

  // Increase the timeout to ensure enough time for Spring Boot to start
  const opts = {
    resources: ["http://localhost:8081/api/message"],
    delay: 1000, // initial delay in ms, wait before checking resources
    interval: 100, // poll interval in ms, how often to poll
    timeout: 30000, // timeout in ms, how long to wait before giving up
  };

  waitOn(opts, (err) => {
    if (err) {
      console.error("Error waiting for Spring Boot to start:", err);
      return;
    }
    createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
