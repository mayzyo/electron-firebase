import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain, Menu, shell } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { injectable } from 'inversify'
import RendererOption from '@models/renderer-option'

const isDevelopment = process.env.NODE_ENV !== 'production'

export default interface IUserInterface {
    createWindow(configs: BrowserWindowConfig, options?: BrowserWindowConstructorOptions): BrowserWindow
    closeAll(): void
    connect(window: BrowserWindow, actionMap: Map<string, Function>): void
}

@injectable()
export class UserInterface implements IUserInterface {

    constructor() {
        // Remove menu bar on all window
        Menu.setApplicationMenu(null)
    }

    createWindow(configs: BrowserWindowConfig, options?: BrowserWindowConstructorOptions) {
        let window = new BrowserWindow({ 
            webPreferences: { nodeIntegration: true, enableRemoteModule: false },
            ...options
        })

        this.configureWindow(window, configs)

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

    connect(window: BrowserWindow, actionMap: Map<string, Function>) {

        const listener = async (event: any, type: string, ...args:any[]) => {
            const action = actionMap.get(type)    
            event.returnValue = action ? await action(...args) : false
        }

        ipcMain.on('SERVICE', listener)
        window.once('close', () => ipcMain.removeListener('SERVICE', listener))
    }

    private configureWindow(window: BrowserWindow, configs: BrowserWindowConfig) {
        ipcMain.once('READY', (event) => {
            configs.onReady && configs.onReady()
            event.returnValue = configs.options
        })

        if(configs.actionMap) {
            this.connect(window, configs.actionMap)
        }

        window.setTitle('Electron Firebase')
    }
}

export interface BrowserWindowConfig {
    options: RendererOption, 
    onReady?: Function,
    actionMap?: Map<string, Function>
}