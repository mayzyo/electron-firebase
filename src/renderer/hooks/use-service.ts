import { ipcRenderer } from "electron"

const useService = () => {

    const action = (type: string, ...args: any[]) => ipcRenderer.sendSync('SERVICE', type, ...args)

    return {
        action,
    }
}

export default useService