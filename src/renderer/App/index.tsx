import React from 'react'
import ReactDOM from 'react-dom'

import Auth from './auth'
import logo from '../logo.svg'

const App = () => {
    return (
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Auth />
        </header>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))

export default App