import React from 'react'
import { MenuContainer, MenuItem, MenuList } from '@components'

export default (props: HomeMenu) => {

    return (
        <>

            <MenuContainer
                label="Snatching"
                height={96}
                renderItems={[
                    <MenuItem 
                    label="Track" 
                    icon="TouchPointer"
                    action={() => {}}
                    menuProps={{
                        items: [
                            {
                                key: 'emailMessage',
                                name: 'Email message',
                                icon: 'Mail'
                            },
                            {
                                key: 'calendarEvent',
                                name: 'Calendar event',
                                icon: 'Calendar'
                            }
                        ]
                    }}
                    />,
                    <MenuList items={[
                        { label: 'All Words', icon: 'PageSolid' },
                        {
                            label: 'All Actions', icon: 'OEM', menuProps: {
                                items: [
                                    {
                                        key: 'emailMessage',
                                        name: 'Email message',
                                        icon: 'Mail'
                                    },
                                    {
                                        key: 'calendarEvent',
                                        name: 'Calendar event',
                                        icon: 'Calendar'
                                    }
                                ]
                            }
                        },
                        // {label: 'test3', icon: 'GlobalNavButton'},
                    ]} />
                ]}
            />

            <MenuContainer
                label="Definition"
                height={96}
                renderItems={[
                    <MenuList items={[
                        { label: 'Set Anchor', icon: 'AnchorLock' , action: () => {} },
                        { label: 'Set Data', icon: 'Dataflows', action: () => {} },
                        { label: 'Clear', icon: 'Filters', action: () => {} },
                    ]} />
                ]}
            />

        </>
    )
}

export interface HomeMenu {

}