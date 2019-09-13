import { app, BrowserWindow, ipcMain } from 'electron'
import Container from "./utilities/container"
import { TYPES } from "./utilities/types"
import { IAuthentication, IUserInterface } from './core'
import { IpcEvent } from './core/user-interface'

const authentication = Container.get<IAuthentication>(TYPES.Authentication)
const userInterface = Container.get<IUserInterface>(TYPES.UserInterface)

let mainWindow: BrowserWindow | null

ipcMain.on('ERROR', (event: IpcEvent, args: { message: string }) => {
    console.log('error', args)
    if(BrowserWindow.getAllWindows().length <= 1) {
        app.quit()
    } else {
        BrowserWindow.fromWebContents(event.sender.WebContents).close()
    }
})

const loadMain = () => {
    const window = userInterface.createWindow({ width: 1100, height: 600 })
    window.configure({ route: 'Home' }, () => window.once('close', () => app.quit()))
    mainWindow = window
    ipcMain.once('LOGOUT', async (event: IpcEvent) => {
        mainWindow = null
        window.close()
        await authentication.logout()
        await authentication.show()
        loadMain()
    })
}

app.on('activate', async () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        await authentication.show()
        loadMain()
    }
})

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
    await authentication.show()
    loadMain()
})