import React from 'react'
import { MenuItem } from './menu-item'
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button'

const group = (items: MenuItem[], size: number) => {
    // size = Math.floor(items.length / size) + 1

    return items.reduce((acc, cur, i) => {
        if (i % size == 0) {
            acc.push([cur])
        } else {
            acc[acc.length - 1].push(cur)
        }

        return acc
    }, new Array<MenuItem[]>())
}

export default (props: MenuList) => {
    
    return (
        <div className="row" style={{ height: '100%' }}>
            { group(props.items, 3).map((g, i) =>
                <div key={i} className={`col-auto ${ (i == 0 && g.length == 3) ? '' : 'align-self-center' }`}>
                    {g.map((el, t) =>
                        <div key={t} className="row" style={{ 
                            height: '33.33%',
                            padding: (i == 0 && g.length == 3) ? '0' : '10% 0'
                        }}>
                            <CommandBarButton
                            iconProps={{ iconName: el.icon }}
                            text={el.label}
                            split={true}
                            onClick={() => el.action && el.action()}
                            menuProps={el.menuProps && el.menuProps}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export interface MenuList {
    items: MenuItem[]
}