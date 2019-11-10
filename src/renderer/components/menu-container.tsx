import React from 'react'
import { Text } from 'office-ui-fabric-react/lib/Text'

export default (props: MenuContainer) => {
    return (
        <div className="container-fluid" style={{ borderRight: '.5px solid rgba(0,0,0,0.1)', paddingTop: 5 }}>
            <div className="row" style={{ height: props.height }}>
                { props.renderItems.map((el, i) => 
                    <div className="col-auto" key={i}>
                        {el}
                    </div>
                )}
            </div>
            <div className="row justify-content-center">
                <div className="col-auto" style={{ fontSize: 12 }}>
                    <Text variant="small">{props.label}</Text>
                </div>
            </div>
        </div>
    )
}

export interface MenuContainer {
    label: string
    height: number
    renderItems: JSX.Element[]
}