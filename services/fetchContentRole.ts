import { UserRole } from "@/types/databaseUserRole";
import { supabase } from "../lib/supabase";

export const fetchContentByRole = async (role: UserRole | null) => {
  let query = supabase.from("posts").select(`*,profiles(full_name)`);
  if (role?.is_investor) {
    query = query.eq("category", "Investment");
  } else if (role?.is_jobseeker) {
    query = query.eq("category", "Hiring");
  } else if (role?.is_entrepreneur) {
    query = query.eq("category", "Job Seeking");
  }
  const { data, error } = await query;
  if (error) {
    console.error("fetchContentByRole", error.message);
    return [];
  }
  return data;
};
