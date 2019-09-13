import React from 'react'
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot'
import { Label } from 'office-ui-fabric-react/lib/Label'
import { IconButton, ActionButton } from 'office-ui-fabric-react/lib/Button'
import styled from 'styled-components'

// LOCAL DEPENDENCIES
import Landing from './landing'
import { ipcRenderer } from 'electron'

export default () => {
    return (
        <>
            <Pivot>
                <PivotItem
                    headerText="Home"
                    headerButtonProps={{
                        'data-order': 1,
                        'data-title': 'My Files Title'
                    }}
                >
                    <Landing />
                </PivotItem>
                <PivotItem headerText="Tools">
                    <Label>Pivot #2</Label>
                </PivotItem>
                <PivotItem headerText="Companions">
                    <Label>Pivot #3</Label>
                </PivotItem>
                <PivotItem headerText="Games">
                    <Label>Pivot #3</Label>
                </PivotItem>
            </Pivot>
            <ButtonView>
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
                // onClick={this._handleSettingsIconClick}
                />
            </ButtonView>
        </>
    )
}

// STYLE PROPERTIES
const ButtonView = styled.div(props => ({
    position: 'absolute',
    right: 0,
    top: 0,
    display: 'flex'
}))