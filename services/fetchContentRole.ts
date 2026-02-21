import { UserRole } from '@/types/database';
import { supabase } from '../lib/supabase';

export const fetchContentByRole= async(role:UserRole|null)=>{
    let query = supabase.from('posts').select(`*,profiles(full_name)`)
    if(role?.is_investor){
        query =  query.eq('category','investment_opportunity')
    }else if(role?.is_jobseeker){
        query =  query.eq('category','job_opening')
    }else if(role?.is_entrepreneur){
        query =  query.eq('category','investor_searching')
    }
    const {data,error} = await query
    if(error){
        console.error(error)
        return []
    }
    return data
}