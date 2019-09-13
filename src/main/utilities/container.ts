import { Container } from "inversify"
import { TYPES } from "./types"
import IAuthentication, { Authentication } from "../core/authentication"
import IUserInterface, { UserInterface } from "../core/user-interface"

const container = new Container()

// Core Library
container.bind<IAuthentication>(TYPES.Authentication).to(Authentication).inSingletonScope()
container.bind<IUserInterface>(TYPES.UserInterface).to(UserInterface)

export default container