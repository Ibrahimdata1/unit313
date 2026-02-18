import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { supabase } from '../../lib/supabase'
export default function LoginScreen(){
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)
    const router = useRouter()
    const onSignInPress = async()=>{
        setLoading(true)
        const {error} = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if(error){
            Alert.alert('Log in Failed',error.message)
        }else{
            router.replace('/(tabs)')
        }
        setLoading(false)
    }
    return(
        <View>
            <Text>test</Text>
        </View>
    )
}