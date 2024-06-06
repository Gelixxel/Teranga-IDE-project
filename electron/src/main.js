const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const waitOn = require('wait-on');

let mainWindow;
let springBootProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL('http://localhost:8081').then(() => {
        console.log('Loaded URL successfully');
    }).catch((error) => {
        console.error('Failed to load URL:', error);
    });

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
        if (springBootProcess) {
            springBootProcess.kill();
        }
    });
}

app.on('ready', () => {
    console.log('App is ready');
    const jarPath = path.join(process.resourcesPath, 'PingProject-1.0-SNAPSHOT.jar');

    springBootProcess = exec(`java -jar ${jarPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Spring Boot Error: ${error}`);
            return;
        }
        console.log(`Spring Boot: ${stdout}`);
        console.error(`Spring Boot Error: ${stderr}`);
    });

    // Wait for Spring Boot to start by checking the availability of the backend URL
    const opts = {
        resources: ['http://localhost:8081'],
        delay: 1000, // initial delay in ms, wait before checking resources
        interval: 100, // poll interval in ms, how often to poll
        timeout: 30000, // timeout in ms, how long to wait before giving up
    };

    waitOn(opts, (err) => {
        if (err) {
            console.error('Error waiting for Spring Boot to start:', err);
            return;
        }
        createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
