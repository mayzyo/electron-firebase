import React, { useState } from 'react'
import { Ribbon } from '@components'
import HomeMenu from './home-menu'

const TextEditor = () => {

    const [mouseY, setMouseY] = useState(0)

    return (
        <div onClick={e => setMouseY(e.clientY)}>
            <Ribbon
            mouseY={mouseY} 
            menus={[
                { title:'Home', renderItem: <HomeMenu />  }
            ]}
            />
                <div>Text Editor</div>
            {/* <Browser onReady={setViewReady}>
                {LeftMenuRenderer()}
            </Browser> */}
        </div>
    )
}

export default () => <TextEditor />