import { Session } from '@supabase/supabase-js';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function indexPage(){


const [session,setSession] = useState<Session|null>(null)
const [loading,setLoading] = useState(true)
useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
        setSession(session);
        setLoading(false)
    });
    const {data:authListener} = supabase.auth.onAuthStateChange((_event,session)=>{
        setSession(session)
        setLoading(false)
    });
    return()=>{
        authListener.subscription.unsubscribe()
    }
},[])
if(loading){
    return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size="large"  color='#1B5E20'/>
        </View>
    )
}
if(!session){
    return(
        <Redirect href={'/(auth)/login' as any}/> //error url unknow reason
    )
}
return(
    <Redirect href='/(tabs)'/>
)
}