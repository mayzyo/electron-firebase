import React from 'react'
import { Text } from 'office-ui-fabric-react/lib/Text'
import styled from 'styled-components'

export default (props: MenuContainer) => {
    return (
        <Container>
            <MenuView height={props.height}>
                { props.renderItems.map((el, i) => 
                    <MenuItemView key={i}>{el}</MenuItemView>
                )}
            </MenuView>
            <LabelView>
                <Text variant="small">{props.label}</Text>
            </LabelView>
        </Container>
    )
}

// STYLE PROPERTIES
const Container = styled.div(props => ({
    display: 'flex', 
    flexDirection: 'column', 
    borderRight: '.5px solid rgba(0,0,0,0.1)', 
    padding: '5px 10px 0 10px',
}))
const MenuView = styled.div<{ height: number }>(props => ({
    display: 'flex', 
    flexDirection: 'row', 
    height: props.height,
    paddingBottom: 5
}))
const MenuItemView = styled.div(props => ({
    display: 'flex',
    flexDirection: 'column'
}))
const LabelView = styled.div(props => ({
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'center',
    fontSize: 12
}))

export interface MenuContainer {
    label: string
    height: number
    renderItems: JSX.Element[]
}