import { supabase } from "@/lib/supabase";
import { fetchUserRole } from "@/services/fetchUserRole";
import { UserRole } from "@/types/databaseUserRole";
import { useShowToast } from "@/utils/useShowToast";
import {
    Text
} from "@gluestack-ui/themed";
import { useEffect, useState } from "react";

export default function ProfileScreen(){
    const {showToast} = useShowToast()
    const [profile,setProfile] = useState<any>(null)
    const [role,setRole] = useState<UserRole | null>(null)
    const fetchProfile = async()=>{
        const{data:{user},error:fetchUserError} = await supabase.auth.getUser()
        if(!user){
            throw new TypeError('User Error')
        }
        if(fetchUserError){
             showToast(
          "Failed to fetch data",
          "Please contact customer support or refresh app",
          "error",
          "top",
          "accent",
        );
        throw fetchUserError;
        }
        const {data,error:fetchProfileError}  = await supabase.from('profiles').select(`
    *, 
    investor (
      investment_capacity,
      interest_sector
    ),
    entrepreneur(
    investment_capacity,
    business_plan_url),
    jobseeker(
    resume_url,skills,expected_salary)
  `).eq('id',user.id).single()
  if(fetchProfileError){
      showToast(
          "Failed to fetch data",
          "Please contact customer support or refresh app",
          "error",
          "top",
          "accent",
        );
        throw fetchProfileError;
  }
  setProfile(data)
    }
    useEffect(()=>{
        const fetchData = async()=>{
  await fetchProfile()
      const data= await fetchUserRole()
      setRole(data)
        }
        fetchData()
    },[])
    if (!profile) return <Text>Loading profile...</Text>;
    
    
} 