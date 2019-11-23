import React, { useState } from 'react'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot'
import { IconButton, ActionButton } from 'office-ui-fabric-react/lib/Button'
import { useService } from '@hooks'
import Project from '@models/project'

// LOCAL DEPENDENCIES
import Landing from './landing'
import List from './list'
import Auth from './auth'

const AppList = () => {

    const { action } = useService()
    const [projects] = useState<Project[]>(action('projectManifests'))
    const [showLogin, setShowLogin] = useState(false)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: window.innerHeight }}>
            <Pivot headersOnly={showLogin} onLinkClick={() => setShowLogin(false)}>
                <PivotItem headerText="Tools">
                    <List projects={projects} handleHref={(url: string) => action('navigate', url)} />
                </PivotItem>
                <PivotItem headerText="Companions">
                    <List projects={[]} handleHref={(url: string) => action('navigate', url)} />
                </PivotItem>
                <PivotItem headerText="Games">
                    <Landing />
                </PivotItem>
            </Pivot>
            
            <UserView>
                <ActionButton 
                iconProps={{ iconName: 'SignOut' }} 
                text="Logout" 
                onClick={() => ipcRenderer.send('LOGOUT')}
                />
                <IconButton style={{ padding: '20px 10px' }}
                    iconProps={{
                        iconName: 'StatusCircleOuter',
                        // style: { color: this.state.selectedKey === 'Settings' ? 'blue' : 'black' } 
                    }}
                onClick={() => setShowLogin(true)}
                />
            </UserView>

            { showLogin ? <Auth /> : null }
        </div>
    )
}

// STYLE PROPERTIES
const UserView = styled.div(props => ({
    position: 'absolute',
    right: 0,
    top: 0,
    display: 'flex'
}))

export default () => <AppList />