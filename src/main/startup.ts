import { app, BrowserWindow, shell } from 'electron'
import fs from 'fs'
import path from 'path'
import Container from "@utils/container"
import { TYPES } from "@utils/types"
import { IAuthentication, IUserInterface } from '@services'
import Project from '@models/project'

// Dependency Injection Setup
const authentication = Container.get<IAuthentication>(TYPES.Authentication)
const userInterface = Container.get<IUserInterface>(TYPES.UserInterface)
// let browserWindow: BrowserWindow
const projectManifests = () => {
    const uri = path.join(__static, 'files', 'project-manifests.json')
    const projects: Project[] = JSON.parse(fs.readFileSync(uri, 'utf8'))

    projects.forEach(el => {
        if(el.icon) {
            const iconUri = path.join(__static, 'images', el.icon)
            el.icon = fs.readFileSync(iconUri, 'utf8')
        }
    })

    return projects
}

const navigate = (href: string) => {
    if(href.startsWith('https') || href.startsWith('http')) {
        shell.openExternal(href)
    } else {
        BrowserWindow.getAllWindows()
        .filter(el => el != mainWindow)
        .forEach(el => el.close())

        userInterface.createWindow(
            { options: { route: href } }, 
            { width: 1280, height: 720 }
        )
    }
}

export let mainWindow: BrowserWindow | null

export const startup = () => {
    const window = userInterface.createWindow(
        {
            options: { route: 'AppList' },
            onReady: () => window.once(
                'close', 
                () => app.quit()
            )
        },
        { width: 420, height: 680, resizable: false }
    )

    userInterface.connect(window, new Map([
        ['projectManifests', projectManifests],
        ['navigate', navigate]
    ]))
    console.log('FORCE REFRESH')
    mainWindow = window
}