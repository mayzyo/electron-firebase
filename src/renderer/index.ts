import { ipcRenderer } from "electron"
import ReactDOM from 'react-dom'
import { initializeIcons } from '@uifabric/icons'
import Authentication from "./core/authentication"
import RendererOption from "../common/renderer-option"
import Home from "./core/home"

document.body.style.margin = '0'
initializeIcons()

let initial: RendererOption = ipcRenderer.sendSync('READY')

switch (initial.route) {
    case 'Auth':
        ReactDOM.render(Authentication(), document.getElementById('app'))
        break
    case 'Home':
        ReactDOM.render(Home(), document.getElementById('app'))
        break
    default:
        ipcRenderer.send('ERROR', { message: 'No route was found' })
}

if (module.hot) {
    module.hot.accept('./core/home', function () {
        ReactDOM.render(Home(), document.getElementById('app'))
    })
}