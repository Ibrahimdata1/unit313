import { supabase } from '@/lib/supabase'
import { Box, Button, ButtonText, Center, FormControl, Heading, Input, InputField, InputIcon, InputSlot, Text, Toast, ToastDescription, ToastTitle, useToast, VStack } from '@gluestack-ui/themed'
import { useRouter } from 'expo-router'
import { Lock, Mail } from 'lucide-react-native'
import { useState } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
export default function RegisterScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [phone, setPhone] = useState<Number>()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const space = useSafeAreaInsets()
    const router = useRouter()
    const handleRegister = async () => {
        if (password !== confirmPassword) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast nativeID={id} action='error' variant='accent' style={{ marginTop: space.top }}>
                        <VStack space='xs'>
                            <ToastTitle>Password do not match!</ToastTitle>
                            <ToastDescription>Please make sure both password are the same</ToastDescription>
                        </VStack>
                    </Toast>
                )
            })
            return
        }
        setLoading(true)
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })
        if (error) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast nativeID={id} action='error' variant='accent' style={{ marginTop: space.top }}>
                        <VStack space='xs'>
                            <ToastTitle>Registeration Failed!</ToastTitle>
                            <ToastDescription>{error.message}</ToastDescription>
                        </VStack>
                    </Toast>
                )

            })
            setLoading(false)
        }else{
            toast.show({
                placement:'top',
                render:({id})=>(
                    <Toast nativeID={id} variant='accent' action='success' style={{marginTop:space.top}}>
                        <VStack space='xs'>
                            <ToastTitle>Registeration Success!</ToastTitle>
                            <ToastDescription>Check your email for the confirmation link</ToastDescription>
                        </VStack>
                    </Toast>
                )
            })
            setLoading(false)
            router.replace('/login')
        }
    }
    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Center flex={1} bg='$white' p='$4'>
                <Box maxWidth='$96' width='100%' p='$6' borderRadius='$lg' borderWidth='$1' borderColor='$borderLight200' bg='$backgroundCard'>
                    <VStack space='xl'>
                       <VStack space='xs'>
                         <Heading size='xl' color='$text900'>Create Account</Heading>
                        <Text size='sm' color='$text500'>Join Unit313</Text>
                       </VStack>
                       <VStack space='md'>
                            <FormControl>
                                <Input variant='outline' size='md'>
                                    <InputSlot pl='$3'>
                                    <InputIcon as={Mail} color='$text500'/>
                                    </InputSlot>
                                    <InputField placeholder='Email Address'value={email} onChangeText={setEmail} autoCapitalize='none'/>
                                </Input>
                            </FormControl>
                            <FormControl>
                                <Input variant='outline' size='md'>
                                    <InputSlot pl='$3'>
                                        <InputIcon as={Lock} color='$text500'/>
            
                                    </InputSlot>
                                    <InputField placeholder='Password' value={password} onChangeText={setPassword} type='password' autoCapitalize='none'/>
                                </Input>
                            </FormControl>
                            <FormControl>
                                <Input variant='outline' size='md'>
                                    <InputSlot pl='$3'>
                                        <InputIcon as={Lock} color='$text500'/>
                                    </InputSlot>
                                    <InputField placeholder='Confirm Password' value={confirmPassword} onChangeText={setConfirmPassword} type='password'autoCapitalize='none'/>
                                </Input>
                            </FormControl>
                       </VStack>
                       <Button variant='solid' onPress={handleRegister} action='primary' bg='$black' isDisabled={loading}>
                            {loading ? <ButtonText>Processing...</ButtonText>:<ButtonText color='$white'>Register</ButtonText>}
                       </Button>
                       <Button variant='link' onPress={()=>router.replace('/login')}>
                            <ButtonText size='sm'>Already have an account? Sign In</ButtonText>
                       </Button>
                       <Text size='xs' color='$text400' textAlign='center'>Unit 313 one ummah</Text>
                    </VStack>
                </Box>
            </Center>
        </TouchableWithoutFeedback>
    )
}