import { ipcMain, BrowserWindow, app as ElectronApp } from "electron"
import { injectable, inject } from "inversify"
import { initializeApp, app as FirebaseApp, User, auth } from 'firebase'
import Crypto from 'crypto'
import ElectronStore from 'electron-store'
import { TYPES } from "../utilities/types"
import AuthForm from "../../common/auth-form"
import IUserInterface, { IpcEvent } from "./user-interface"

const SALT = 'salt'

export default interface IAuthentication {
    show(): Promise<void>
    signin(email: string, password: string): Promise<User | string>
    logout(): Promise<true | string>
}

@injectable()
export class Authentication implements IAuthentication {

    @inject(TYPES.UserInterface) private userInterface!: IUserInterface
    readonly firebaseApp: FirebaseApp.App
    readonly localStorage = new ElectronStore()

    constructor() {
        // Initialize Firebase
        this.firebaseApp = initializeApp({
            apiKey: "AIzaSyBVlpmxj7PGBO5THWvBagfq612KpismVvo",
            authDomain: "hello-firebase-1d6fc.firebaseapp.com",
            databaseURL: "https://hello-firebase-1d6fc.firebaseio.com",
            projectId: "hello-firebase-1d6fc",
            storageBucket: "hello-firebase-1d6fc.appspot.com",
            messagingSenderId: "760507585405",
            appId: "1:760507585405:web:521de7303a07a749"
        })
        // // this.database = firestore()
        // auth().onAuthStateChanged(user => this.fetchCollection(user))
    }

    show() {
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

        const authWindow = this.userInterface.createWindow({ width: 400, height: 600, resizable: false })

        return new Promise<void>((resolve, reject) => {
            authWindow.configure({ route: 'Auth'}, () => this.onReady(authWindow, resolve))
        })
    }

    async signin(email: string, password: string) {
        let response: auth.UserCredential
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
        
        ipcMain.once('AUTHENTICATION', async (event: IpcEvent, payload: AuthForm | undefined) => {

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
}