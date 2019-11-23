import React from 'react'
import { MenuItem } from './menu-item'
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button'
import styled from 'styled-components'

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
        <Container>
            { group(props.items, 3).map((g, i) =>
                <ListGroupView key={i}>
                    {g.map((el, t) =>
                        <ListItemView>
                            <CommandBarButton
                            iconProps={{ iconName: el.icon }}
                            text={el.label}
                            split={true}
                            onClick={() => el.action && el.action()}
                            menuProps={el.menuProps && el.menuProps}
                            />
                        </ListItemView>
                    )}
                </ListGroupView>
            )}
        </Container>
    )
}

// STYLE PROPERTIES
const Container = styled.div(props => ({
    display:'flex',
    flexGrow: 1
}))
const ListGroupView = styled.div(props => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
}))
const ListItemView = styled.div(props => ({
    display: 'flex', 
    flexDirection: 'row',
    height: '33.33%',
}))


export interface MenuList {
    items: MenuItem[]
}