import React from 'react'
import styled from 'styled-components'

export default () => {

    return (
        <Container style={{ width: '100%' }}>
            <LargeBox>Large</LargeBox>
            <LeftView>
                <ListView>
                    <SmallBox>small</SmallBox>
                    <SmallBox>small</SmallBox>
                    <SmallBox>small</SmallBox>
                    <SmallBox>small</SmallBox>
                </ListView>
                <ListView>
                    <MediumBox>Medium</MediumBox>
                    <MediumBox>Medium</MediumBox>
                </ListView>
            </LeftView>
        </Container>
    )
}

// STYLE PROPERTIES
const Container = styled.div(props => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
}))
const LeftView = styled(Container)(props => ({
    flexGrow: 1, 
}))
const ListView = styled.div(props => ({
    width: '100%'
}))
const BoxView = styled.div(props => ({
    color: '#ffffff',
    backgroundColor: '#333333',
}))
const SmallBox = styled(BoxView)(props => ({
    // margin: 4,
    margin: '4px 2px',
    height: 100 - 3,
}))
const MediumBox = styled(BoxView)(props => ({
    margin: 4,
    height: 200 - 2,
}))
const LargeBox = styled(BoxView)(props => ({
    flexGrow: 1,
    margin: 4,
    height: 400,
}))