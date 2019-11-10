import { app, BrowserWindow, ipcMain } from 'electron'
import { startup, mainWindow } from './startup'

// Setup globally for Firebase to work
(global as any).XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

// Error Handling for Electron
ipcMain.on('ERROR', (event, args: { message: string }) => {
    console.log('error', args)
    if(BrowserWindow.getAllWindows().length <= 1) {
        app.quit()
    } else {
        BrowserWindow.fromWebContents(event.sender.hostWebContents).close()
    }
})

// on macOS it is common to re-create a window even after all windows have been closed
app.on('activate', () => mainWindow == null ? startup() : null)
// create main BrowserWindow when electron is ready
app.on('ready', () => startup())