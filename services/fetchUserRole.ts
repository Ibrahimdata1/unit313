import { supabase } from '../lib/supabase';
export const fetchUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null;
    const { data, error } = await supabase.from('profiles').select('is_investor, is_jobseeker, is_entrepreneur').eq('id', user.id)
        .single();
    if (error) {
        console.error(error)
        return null
    }
    return data
}
