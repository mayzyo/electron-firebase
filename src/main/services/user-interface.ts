import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain, Menu, shell } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { injectable } from 'inversify'
import RendererOption from '@models/renderer-option'

const isDevelopment = process.env.NODE_ENV !== 'production'

export default interface IUserInterface {
    createWindow(options?: BrowserWindowConstructorOptions): BrowserWindowExtension
    closeAll(): void
    open(href: string): void
    connect(actionMap: Map<string, Function>): (event: any, type: string, ...args: any[]) => Promise<any>
    remove(listener: (event: any, type: string, ...args: any[]) => Promise<any>): void
}

@injectable()
export class UserInterface implements IUserInterface {

    constructor() {
        // Remove menu bar on all window
        Menu.setApplicationMenu(null)
    }

    createWindow(options?: BrowserWindowConstructorOptions) {
        let window = new BrowserWindowExtension({ 
            webPreferences: { nodeIntegration: true, enableRemoteModule: false },
            ...options
        })

        window.setTitle('Electron Firebase')

        if (isDevelopment) {
            window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
            window.webContents.openDevTools()
        }
        else {
            window.loadURL(formatUrl({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file',
                slashes: true
            }))
        }
    
        return window
    }

    closeAll() {
        BrowserWindow.getAllWindows().forEach(el => el.close())
    }

    open(href: string) {
        shell.openExternal(href)
    }

    connect(actionMap: Map<string, Function>) {

        const listener = async (event: any, type: string, ...args:any[]) => {
            const action = actionMap.get(type)    
            event.returnValue = action ? await action(...args) : false
        }

        ipcMain.on('SERVICE', listener)
        return listener
    }

    remove(listener: (event: any, type: string, ...args: any[]) => Promise<any>) {
        ipcMain.removeListener('SERVICE', listener)
    }
}

class BrowserWindowExtension extends BrowserWindow {

    constructor(options?: BrowserWindowConstructorOptions | undefined) { super(options)
    }

    configure(options: RendererOption, onReady?: Function) {
        ipcMain.once('READY', (event) => {
            onReady && onReady()
            event.returnValue = options
        })
    }
}