import { ipcRenderer } from "electron"
import ReactDOM from 'react-dom'
import { initializeIcons } from '@uifabric/icons'
import { AppList } from '@components'
import RendererOption from "@models/renderer-option"

document.body.style.margin = '0'
initializeIcons()

let initial: RendererOption = ipcRenderer.sendSync('READY')

switch (initial.route) {
    case 'AppList':
        ReactDOM.render(AppList(), document.getElementById('app'))
        break
    default:
        ipcRenderer.send('ERROR', { message: 'No route was found' })
}

if (module.hot) {
    switch (initial.route) {
        case 'AppList':
            module.hot.accept('@components', () => {
                ReactDOM.render(AppList(), document.getElementById('app'))
            })
            break
    }
}