import React, { useState, useEffect } from 'react'
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot'
import { IconButton } from 'office-ui-fabric-react/lib/Button'

export default (props: Ribbon) => {
    const [expanded, setExpanded] = useState(true)
    const [pinned, setPinned] = useState(true)

    const handleButton = () => {
        if (pinned) {
            setExpanded(false)
            setPinned(false)
        } else {
            setPinned(true)
        }
    }

    useEffect(() => {
        if (props.mouseY != undefined && !pinned && expanded && props.mouseY > 138) {
            setExpanded(false)
        }
    }, [props.mouseY])

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
                    <div className="container-fluid">
                        <div className="row justify-content-between">

                            <div className="col-auto pl-4">
                                {el.renderItem}
                            </div>

                            <div className="col-auto align-self-end">
                                <IconButton
                                    onClick={e => handleButton()}
                                    iconProps={{ iconName: pinned ? 'ChevronUp' : 'Pin' }}
                                    title={pinned ? 'Hide Menu' : 'Pin Menu'}
                                    ariaLabel={pinned ? 'Hide Top Menu' : 'Pin Top Menu'}
                                />
                            </div>

                        </div>
                    </div>
                </PivotItem>
            )}
        </Pivot>
    )
}

export interface Ribbon {
    mouseY?: number,
    menus: { title: string, renderItem: JSX.Element }[]
}