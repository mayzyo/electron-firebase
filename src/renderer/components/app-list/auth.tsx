import React, { FormEvent, useState } from 'react'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'
import { Text } from 'office-ui-fabric-react/lib/Text'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'
import AuthForm from '@models/auth-form'

const Authentication = () => {

    const [form, setForm] = useState<AuthForm>({ username: '', password: '' })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        ipcRenderer.send('AUTHENTICATION', form)
        e.preventDefault()
    }

    const handleAnonymous = () => {
        ipcRenderer.send('AUTHENTICATION', {})
    }

    return (
        <Container>

            <Text variant="xLarge">Authenticate</Text>

            <form style={{ marginTop: 40 }} onSubmit={handleSubmit}>
                <InputView>
                    <TextField 
                    value={form.username}
                    onChange={(e, val) => setForm(p => ({ ...p, username: val || '' }))}
                    label="Username" 
                    type="email" 
                    underlined 
                    required
                    />
                </InputView>
                
                <InputView>
                    <TextField 
                    value={form.password}
                    onChange={(e, val) => setForm(p => ({ ...p, password: val || '' }))}
                    label="Password" 
                    type="password" 
                    underlined  
                    required
                    />
                </InputView>
                
                <ButtonView>
                    <PrimaryButton text="Sign In" type="submit" />
                    <DefaultButton 
                    style={{ marginLeft: 10 }}
                    text="Continue anonymously..." 
                    onClick={() => ipcRenderer.send('CLOSE_AUTH')} 
                    />
                </ButtonView>
            </form>

        </Container>
    )
}

// STYLE PROPERTIES
const Container = styled.div(props => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
}))
const InputView = styled.div(props => ({
    marginTop: 10,
    marginBottom: 10
}))
const ButtonView = styled.div(props => ({
    marginTop: 25
}))

export default () => <Authentication />