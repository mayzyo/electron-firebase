import React from 'react'
import styled from 'styled-components'
import {
    DocumentCard,
    DocumentCardActions,
    DocumentCardDetails,
    DocumentCardTitle,
    DocumentCardType,
  } from 'office-ui-fabric-react/lib/DocumentCard'
import Project from '@models/project'

export default (props: List) => {
    return (
        <Container>
            { props.projects.map(el =>(
                <DocumentCard 
                key={el.name} 
                type={DocumentCardType.compact} 
                style={{ margin: 10 }} 
                onClick={() => props.handleHref(el.uri)}
                >

                    <PreviewView dangerouslySetInnerHTML={el.icon ? { __html: el.icon } : undefined} /> 

                    <DocumentCardDetails>
                        <DocumentCardTitle title={el.name} shouldTruncate={true} />
                        <DocumentCardActions
                        actions={[
                            {
                            iconProps: { iconName: 'Share' },
                            onClick: () => {},
                            ariaLabel: 'share action'
                            },
                            {
                            iconProps: { iconName: 'Pin' },
                            onClick: () => {},
                            ariaLabel: 'pin action'
                            },
                            {
                            iconProps: { iconName: 'Ringer' },
                            onClick: () => {},
                            ariaLabel: 'notifications action'
                            }
                        ]}
                        />
                    </DocumentCardDetails>

                </DocumentCard>
            ))}
        </Container>

    )
}

// STYLE PROPERTIES
const Container = styled.div(props => ({
    flex: 1
}))
const PreviewView = styled.div(props => ({
    width: 100, 
    padding: '0 26px', 
    borderRight: 'solid 1px rgba(0,0,0,0.1)'
}))

export interface List {
    projects: Project[]
    handleHref: (url: string) => void
}