const electron = require('electron');
const app = electron.app;
const fs = require('fs');
const path = require('path');

const devMode = process.defaultApp;

if (devMode && process.argv.includes('--electron-reload')) {
    require('electron-reload')(path.join(__dirname, 'output'), {
        electron: process.execPath,
    });
}

const customProtocol = 'vantage';

function handleSquirrel(argv) {
    if (argv.length < 2 || !argv[1].startsWith('--squirrel-')) {
        return false;
    }

    const action = argv[1].substr('--squirrel-'.length);
    if (!['install', 'updated', 'uninstall'].includes(action)) {
        return false;
    }

    const updateExe = path.resolve(process.execPath, '..', '..', 'Update.exe');
    const exeName = path.basename(process.execPath);
    const child_process = require('child_process');

    const removeShortcut = () => child_process.spawnSync(updateExe, ['--removeShortcut', exeName]);

    if (action === 'install' || action === 'updated') {
        const createShortcut = () => child_process.spawnSync(updateExe, ['--createShortcut', exeName]);

        if (action === 'install') {
            createShortcut();
        } else {
            try {
                const desktop = app.getPath('desktop');
                try {
                    fs.statSync(path.join(desktop, exeName.replace('.exe', '') + '.lnk'));
                    removeShortcut();
                    createShortcut();
                } catch (e) {

                }
            } catch (e) {
                createShortcut();
            }
        }

        return true;
    }

    if (action === 'uninstall') {
        if (app.isDefaultProtocolClient(customProtocol)) {
            app.removeAsDefaultProtocolClient(customProtocol);
        }
        removeShortcut();
        return true;
    }

    return false;
}

if (handleSquirrel(process.argv)) {
    app.quit();
    return;
}

let mainWindow;

const secondInstance = app.makeSingleInstance(argv => {
    if (mainWindow) {
        mainWindow.webContents.send('argv', argv);
    }
});

if (secondInstance) {
    app.quit();
    return;
}

function getUserDataPath() {
    const userDataPath = path.join(app.getPath('userData'), 'App');
    try {
        fs.mkdirSync(userDataPath);
    } catch (e) {

    }
    return userDataPath;
}

function overlaps(r1, r2) {
    if (
        r1.x > r2.x + r2.width
        || r1.x + r1.width < r2.x
        || r1.y > r2.y + r2.height
        || r1.y + r1.height < r2.y
    ) {
        return false;
    }
    return true;
}

app.on('window-all-closed', () => app.quit());

app.on('ready', () => {
    mainWindow = new electron.BrowserWindow({
        width: 1000,
        height: 750,
        minWidth: 600,
        minHeight: 350,
        frame: false,
        backgroundColor: '#142328',
        icon: './static/unpacked/logo.png',
        webPreferences: {
            backgroundThrottling: false,
        },
    });

    const userDataPath = getUserDataPath();
    const appConfigPath = path.join(userDataPath, 'init.json');

    let appConfig;
    try {
        appConfig = JSON.parse(fs.readFileSync(appConfigPath, 'utf8'));

        if (appConfig.window.bounds) {
            const display = electron.screen.getDisplayMatching(appConfig.window.bounds);
            if (display && overlaps(appConfig.window.bounds, display.bounds)) {
                mainWindow.setBounds(appConfig.window.bounds);
            }
        }

        if (appConfig.window.maximized) {
            mainWindow.maximize();
        }
    } catch (e) {
        appConfig = {};
    }

    mainWindow.setMenu(null);
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    if (devMode) {
        mainWindow.webContents.openDevTools({
            mode: 'undocked',
        });
    }

    const saveConfig = () => {
        try {
            fs.writeFileSync(appConfigPath, JSON.stringify(appConfig), 'utf8');
        } catch (e) {

        }
    };

    let lastBounds = mainWindow.getBounds();
    mainWindow.on('close', () => {
        appConfig.window = {
            bounds: lastBounds,
            maximized: mainWindow.isMaximized(),
        };
        saveConfig();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    const emitWindowEvent = () => mainWindow.webContents.send('main-window-state');
    mainWindow.on('minimize', emitWindowEvent);
    mainWindow.on('maximize', emitWindowEvent);
    mainWindow.on('unmaximize', emitWindowEvent);
    mainWindow.on('restore', emitWindowEvent);
    mainWindow.on('resize', () => {
        if (!mainWindow.isMaximized()) {
            lastBounds = mainWindow.getBounds();
        }
    });

    if (!devMode) {
        app.setAsDefaultProtocolClient(customProtocol);
    }
});