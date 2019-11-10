import { app, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import Container from "@utils/container"
import { TYPES } from "@utils/types"
import { IAuthentication, IUserInterface } from '@services'
import Project from '@models/project'

// Dependency Injection Setup
const authentication = Container.get<IAuthentication>(TYPES.Authentication)
const userInterface = Container.get<IUserInterface>(TYPES.UserInterface)

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

export let mainWindow: BrowserWindow | null

export const startup = () => {
    const window = userInterface.createWindow({ width: 420, height: 680, resizable: false })
    window.configure(
        { route: 'AppList' }, 
        () => window.once(
            'close', 
            () => app.quit()
        )
    )

    userInterface.connect(new Map([
        ['projectManifests', projectManifests],
        ['open', userInterface.open]
    ]))
    // console.log('FORCE REFRESH')
    mainWindow = window
}