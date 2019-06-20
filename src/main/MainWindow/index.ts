import { ipcMain, BrowserWindow, BrowserWindowConstructorOptions } from "electron"
import firebase, { firestore } from 'firebase'

export default class MainWindow extends BrowserWindow {
    database: firestore.Firestore
    todo: any

    constructor(options?: BrowserWindowConstructorOptions) {
        super(options)

        var firebaseConfig = {
            apiKey: "AIzaSyBVlpmxj7PGBO5THWvBagfq612KpismVvo",
            authDomain: "hello-firebase-1d6fc.firebaseapp.com",
            databaseURL: "https://hello-firebase-1d6fc.firebaseio.com",
            projectId: "hello-firebase-1d6fc",
            storageBucket: "hello-firebase-1d6fc.appspot.com",
            messagingSenderId: "760507585405",
            appId: "1:760507585405:web:521de7303a07a749"
        }
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig)
        this.database = firebase.firestore()
        firebase.auth().onAuthStateChanged(user => this.fetchCollection(user))

        ipcMain.on('loginAuth', this.loginAuth)
        ipcMain.on('logout', this.logout)
    }

    loginAuth = async (event: any, arg: any) => {
        console.log('login request received', arg)
        try {
            var res = await firebase.auth().signInWithEmailAndPassword(arg.email, arg.pass)
            console.log('login request completed', res && ' successfully')
            event.returnValue = res.user ? `Welcome ${res.user.email}` : `Login Unsuccessful`
        } catch {
            event.returnValue = 'something went wrong'
        }

    }

    logout = async (event: any, arg: any) => {
        try {
            await firebase.auth().signOut()
            event.returnValue = 'Securely Logged out'
        } catch {
            event.returnValue = 'something went wrong'
        }
    }

    fetchCollection(user: any) {
        console.log('fetching collection', user && user.email)
        if (user) {
            this.database.collection('todos').get()
            .then(querySnapshot => {
                querySnapshot.forEach(el => this.todo = el.data());
                console.log('collection fetched', this.todo)
            })
        } else {
            this.todo = undefined
            console.log('collection cleared')
        }
    }

    // consoleMsg(msg:string) {
    //     this.webContents.send('consoleMsg', msg)
    // }
}