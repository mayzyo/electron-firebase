import React from 'react'
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button'
import { IContextualMenuProps } from 'office-ui-fabric-react/lib/ContextualMenu'
import styled from 'styled-components'

export default (props: MenuItem) => {
    return (
        <>
            <ButtonView hasContextual={props.menuProps != undefined}>
                <CommandBarButton
                    styles={{
                        flexContainer: { display: 'block' },
                        root: { width: 50 },
                        icon: { fontSize: 28, marginBottom: props.menuProps ? 0 : 10 }
                    }}
                    iconProps={{ iconName: props.icon }}
                    text={!props.menuProps ? props.label : ''}
                    onClick={e => props.action && props.action()}
                />
            </ButtonView>
            
            { props.menuProps &&
                <ContextualView>
                    <CommandBarButton
                        text={props.label}
                        styles={{
                            flexContainer: { display: 'block' },
                            root: { width: 50 }
                        }}
                        menuProps={props.menuProps}
                    />
                </ContextualView>
            }
        </>
    )
}

// STYLE PROPERTIES
const ButtonView = styled.div<{ hasContextual?: boolean }>(props => ({
    display: 'flex', 
    flexDirection: 'row', 
    height: props.hasContextual ? '50%' : '100%'
}))
const ContextualView = styled.div(props => ({
    display: 'flex', 
    flexDirection: 'row', 
    height: '50%' 
}))

export interface MenuItem {
    label: string
    icon: string
    action?: Function
    menuProps?: IContextualMenuProps
}