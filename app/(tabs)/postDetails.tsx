import { supabase } from "@/lib/supabase";
import { useShowToast } from "@/utils/useShowToast";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { showToast } = useShowToast();
  const [post, setPost] = useState();
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const fetchPostDetails = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: postData, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        showToast(
          "Failed to reach data",
          "Please contact customer support or refresh app",
          "error",
          "top",
          "accent",
        );
        throw error;
      }
      setPost(postData);
      if (user && user.id === postData.author_id) {
        setIsAuthor(true);
      }
    } catch (error) {
      console.error("error fetching post", error);
      showToast(
        "Error",
        "Could not load post details",
        "error",
        "top",
        "accent",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPostDetails();
  }, [id]);
  const handleDelete = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        showToast(
          "User not found!",
          "Please try again",
          "error",
          "top",
          "accent",
        );
        return;
      }
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id)
        .eq("author_id", user.id);
      if (error) {
        showToast(
          "Error",
          "Could not load post details",
          "error",
          "top",
          "accent",
        );
        throw error;
      }
      showToast(
        "Deleted Success",
        "Post is deleted",
        "success",
        "top",
        "accent",
      );
      router.back();
    } catch (error) {
      console.error("Delete error:", error);
      showToast(
        "Deleted Failed!",
        "Cannot delete this post",
        "error",
        "top",
        "accent",
      );
    }
  };
}
