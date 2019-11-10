import { BrowserWindow } from "electron"
import { inject, injectable } from "inversify"
import { TYPES } from "@utils/types"
import { IUserInterface } from "@services"

export default interface ITextEditor {

}

@injectable()
export class TextEditor implements ITextEditor {

    @inject(TYPES.UserInterface) userInterface!: IUserInterface
    window?: BrowserWindow & { configure: Function }

    launch() {
        this.window = this.userInterface.createWindow({ width: 420, height: 680, resizable: false })
        this.window.configure(
            { route: 'texteditor' },
        )
    }

    close() {
        this.window && this.window.close()
    }
}