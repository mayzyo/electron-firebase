import React from 'react'
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button'
import { IContextualMenuProps } from 'office-ui-fabric-react/lib/ContextualMenu'

export default (props: MenuItem) => {
    return (
        <>
            <div className="row" style={{ height: props.menuProps ? '50%' : '100%' }}>
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
            </div>
            { props.menuProps &&
                <div className="row" style={{ height: '50%' }}>
                    <CommandBarButton
                        text={props.label}
                        styles={{
                            flexContainer: { display: 'block' },
                            root: { width: 50 }
                        }}
                        menuProps={props.menuProps}
                    />
                </div>
            }
        </>
    )
}

export interface MenuItem {
    label: string
    icon: string
    action?: Function
    menuProps?: IContextualMenuProps
}