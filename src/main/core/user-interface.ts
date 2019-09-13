import { BrowserWindow, WebContents, BrowserWindowConstructorOptions, ipcMain } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { injectable } from 'inversify'
import RendererOption from '../../common/renderer-option'

const isDevelopment = process.env.NODE_ENV !== 'production'

export default interface IUserInterface {
    createWindow(options?: BrowserWindowConstructorOptions): BrowserWindowExtension
}

@injectable()
export class UserInterface implements IUserInterface {

    createWindow(options?: BrowserWindowConstructorOptions) {
        let window = new BrowserWindowExtension({ 
            webPreferences: { nodeIntegration: true, enableRemoteModule: false },
            ...options
        })

        window.setMenu(null)

        if (isDevelopment) {
            window.webContents.openDevTools()
            window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
        }
        else {
            window.loadURL(formatUrl({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file',
                slashes: true
            }))
        }
    
        window.webContents.on('devtools-opened', () => {
            window.focus()
            setImmediate(() => {
                window.focus()
            })
        })
    
        return window
    }

    closeAll() {
        BrowserWindow.getAllWindows().forEach(el => el.close())
    }
}

class BrowserWindowExtension extends BrowserWindow {

    constructor(options?: BrowserWindowConstructorOptions | undefined) { super(options)

    }

    configure(options: RendererOption, onReady: Function) {
        ipcMain.once('READY', (event: IpcSyncEvent<RendererOption>) => {
            onReady()
            event.returnValue = options
        })
    }
}

export interface IpcEvent {
    preventDefault: Function
    sender: { WebContents: WebContents }
    frameId: number
    reply: Function
}

export interface IpcSyncEvent<T> extends IpcEvent {
    returnValue: T
}