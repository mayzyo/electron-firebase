import React, { useState, useEffect } from 'react'
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot'
import { IconButton } from 'office-ui-fabric-react/lib/Button'
import styled from 'styled-components'

export default (props: Ribbon) => {
    const [expanded, setExpanded] = useState(true)
    const [pinned, setPinned] = useState(true)

    const handleMouseClick = (e: MouseEvent) => {
        if(e.screenY > 335 && expanded && !pinned) {
            setExpanded(false)
        }
        // console.log(e.screenY)
    }

    useEffect(() => {
        document.addEventListener('click', handleMouseClick)
        return () => document.removeEventListener('click', handleMouseClick)
    }, [expanded, pinned])

    const handleToggle = () => {
        if (pinned) {
            setExpanded(false)
            setPinned(false)
        } else {
            setPinned(true)
        }
    }

    return (
        <Pivot
            headersOnly={!expanded}
            onLinkClick={e => !expanded && setExpanded(true)}
            styles={{
                link: { minWidth: 75 },
                linkIsSelected: { minWidth: 75 },
                root: { boxShadow: expanded ? '' : '0 3px 2px 0 rgba(0,0,0,0.3)' },
                itemContainer: { boxShadow: expanded ? '0 3px 2px 0 rgba(0,0,0,0.3)' : '' }
            }}
        >
            {props.menus.map(el =>
                <PivotItem headerText={el.title} key={el.title}>
                    <ItemContainer>

                        {el.renderItem}

                        <IconView>
                            <IconButton
                                onClick={e => handleToggle()}
                                iconProps={{ iconName: pinned ? 'ChevronUp' : 'Pin' }}
                                title={pinned ? 'Hide Menu' : 'Pin Menu'}
                                ariaLabel={pinned ? 'Hide Top Menu' : 'Pin Top Menu'}
                            />
                        </IconView>

                    </ItemContainer>
                </PivotItem>
            )}
        </Pivot>
    )
}

// STYLE PROPERTIES
const ItemContainer = styled.div(props => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
}))
const IconView = styled.div(props => ({
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
}))

export interface Ribbon {
    menus: { title: string, renderItem: JSX.Element }[]
}