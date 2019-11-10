import { Container } from "inversify"
import { TYPES } from "./types"
import IAuthentication, { Authentication } from "../services/authentication"
import IUserInterface, { UserInterface } from "../services/user-interface"
import ITextEditor, { TextEditor } from "../text-editor"

const container = new Container()

// Core Library
container.bind<IAuthentication>(TYPES.Authentication).to(Authentication).inSingletonScope()
container.bind<IUserInterface>(TYPES.UserInterface).to(UserInterface)

// Text Editor
container.bind<ITextEditor>(TYPES.TextEditor).to(TextEditor)

export default container