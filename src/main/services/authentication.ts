import { ipcMain, BrowserWindow, app as ElectronApp } from "electron"
import { injectable, inject } from "inversify"
import Firebase from 'firebase/app'
import 'firebase/auth'
import Crypto from 'crypto'
import ElectronStore from 'electron-store'
import { TYPES } from "@utils/types"
import AuthForm from "@models/auth-form"
import IUserInterface from "./user-interface"
import { firebaseKey } from "../keystore"

const SALT = 'salt'

export default interface IAuthentication {
    showWindow(onAuth?: Promise<unknown>, onCancel?: Promise<void>): void
    show(): Promise<void>
    signin(email: string, password: string): Promise<Firebase.User | string>
    logout(): Promise<true | string>
}

enum Action {
    AUTHENTICATE = 'AUTHENTICATE',
}

@injectable()
export class Authentication implements IAuthentication {

    @inject(TYPES.UserInterface) private userInterface!: IUserInterface
    readonly firebaseApp: Firebase.app.App
    readonly localStorage = new ElectronStore()

    constructor() {
        // Initialize Firebase
        this.firebaseApp = Firebase.initializeApp(firebaseKey)
    }

    showWindow(onAuth?: Promise<void>, onCancel?: Promise<void>) {
        const authWindow = this.userInterface.createWindow({ width: 400, height: 600, resizable: false })
        authWindow.configure({ route: 'Auth'})
        const cancel = async () => await onCancel
        authWindow.once('close', cancel)

        ipcMain.once(Action.AUTHENTICATE, async () => {
            authWindow.removeListener('close', cancel)
            onAuth && await onAuth
        })
    }

    show() {
        // const storeItem: string | null = this.localStorage.get('AUTH')
        // if(storeItem) { // Check for Persisted User
        //     const key = Crypto.scryptSync(SALT, SALT, 32)
        //     const decipher = Crypto.createDecipheriv('aes-256-cbc', key, Buffer.alloc(16, 0))
        //     let decrypted = decipher.update(storeItem, 'hex', 'utf8')
        //     decrypted += decipher.final('utf8')
            
        //     return new Promise<void>(async (resolve, reject) => {
        //         const form: AuthForm = JSON.parse(decrypted)
        //         const res = await this.signin(form.username, form.password)

        //         if(typeof res == 'string') { // Account was changed on the server-side
        //             this.localStorage.delete('AUTH')
        //             await this.show()
        //         }

        //         resolve()
        //     })
        // }
        let signin = this.retrieveUser()
        if(!signin) {
            const authWindow = this.userInterface.createWindow({ width: 400, height: 600, resizable: false })

            signin = new Promise<void>((resolve, reject) => {
                authWindow.configure({ route: 'Auth'}, () => this.onReady(authWindow, resolve))
            })
        }

        return signin
    }

    async signin(email: string, password: string) {
        let response: Firebase.auth.UserCredential
        try {
            this.firebaseApp.auth().signInAndRetrieveDataWithCredential
            response = await this.firebaseApp.auth().signInWithEmailAndPassword(email, password)
        } catch(err) {
            console.error(err)
            return 'Signin unsuccessful, connection error'
        }

        return response.user || 'Signin unsuccessful, email and password mismatch'
    }

    async logout() {
        try {
            await this.firebaseApp.auth().signOut()
            this.localStorage.delete('AUTH')
        } catch(err) {
            console.error(err)
            return 'Logout unsuccessful, connection error'
        }

        return true
    }

    private onReady(window: BrowserWindow, resolve: (value?: any) => void) {
        let authing: boolean = false
        window.once('close', () => authing || ElectronApp.quit())
        
        ipcMain.once('AUTHENTICATION', async (event, payload: AuthForm | undefined) => {

            authing = true
            window.hide()

            if(payload) {
                const res = await this.signin(payload.username, payload.password)
                if(typeof res != 'string') {
                    this.persistUser(payload)
                    window.close()
                    resolve()
                } else {
                    window.show()
                    this.onReady(window, resolve)
                }
            } else {
                resolve()
            }
        })
    }

    private persistUser(form: AuthForm) {       
        const key = Crypto.scryptSync(SALT, SALT, 32)
        const cipher = Crypto.createCipheriv('aes-256-cbc', key, Buffer.alloc(16, 0))
        let encrypted = cipher.update(JSON.stringify(form), 'utf8', 'hex')
        encrypted = encrypted += cipher.final('hex')

        console.log('encrypted', encrypted)
        this.localStorage.set('AUTH', encrypted)
    }

    private retrieveUser() {
        const storeItem: string | null = this.localStorage.get('AUTH')
        if(storeItem) { // Check for Persisted User
            const key = Crypto.scryptSync(SALT, SALT, 32)
            const decipher = Crypto.createDecipheriv('aes-256-cbc', key, Buffer.alloc(16, 0))
            let decrypted = decipher.update(storeItem, 'hex', 'utf8')
            decrypted += decipher.final('utf8')
            
            return new Promise<void>(async (resolve, reject) => {
                const form: AuthForm = JSON.parse(decrypted)
                const res = await this.signin(form.username, form.password)

                if(typeof res == 'string') { // Account was changed on the server-side
                    this.localStorage.delete('AUTH')
                    await this.show()
                }

                resolve()
            })
        }

        return null
    }
}