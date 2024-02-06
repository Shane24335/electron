const {app, BrowserWindow, Tray, Menu, ipcMain, nativeTheme, nativeImage} = require('electron')

const path = require('node:path')

let tray

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html')
    ipcMain.handle('dark-mode:toggle', () => {
        if (nativeTheme.shouldUseDarkColors) {
          nativeTheme.themeSource = 'light'
        } else {
          nativeTheme.themeSource = 'dark'
        }
        return nativeTheme.shouldUseDarkColors
    })
      
    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system'
    })
}



app.whenReady().then(() => {
    const icon = nativeImage.createFromPath('\eevee.png')
    tray = new Tray(icon)
    ipcMain.handle('ping', () => 'pong')
    createWindow()

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ])
      
    tray.setContextMenu(contextMenu)

    tray.setToolTip('This is my application')
    tray.setTitle('This is my title')

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})