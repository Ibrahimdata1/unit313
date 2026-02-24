import { supabase } from "@/lib/supabase";
import { CategoryPost } from "@/types/categoryPost";
import { Milestone } from "@/types/postMilestone";
import { useShowToast } from "@/utils/useShowToast";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreatePostScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useShowToast();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mileStones, setMileStones] = useState<Milestone[]>([
    { step: "", is_done: false },
  ]);
  const [mileStoneInput, setMileStoneInput] = useState<string>("");
  const [category, setCategory] = useState<CategoryPost>("Job Seeking");
  const addMileStone = () => {
    setMileStones((prev) => [
      ...prev,
      { step: mileStoneInput, is_done: false },
    ]);
  };
  const removeMileStone = (index: number) => {
    setMileStones((prev) => prev.filter((_, i) => i !== index));
  };
  const updateMileStone = (text: string, index: number) => {
    setMileStones((prev) =>
      prev.map((item, i) => (i === index ? { ...item, step: text } : item)),
    );
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (!user) {
        showToast(
          "Create post failed!",
          "Please try again or contact authority",
          "error",
          "top",
          "accent",
        );
        console.log("handleSave getUser failed", authError?.message);
        return;
      }
      const { error } = await supabase.from("posts").insert([
        {
          author_id: user.id,
          title: title,
          content: content,
          category: category,
          mileStones: mileStones,
          status: "open",
        },
      ]);
      if (error) {
        showToast(
          "Create Post Failed",
          "Please try again or contact customer support",
          "error",
          "top",
          "accent",
        );
        console.error("error insert posts db", error.message);
      } else {
        showToast(
          "Create Post Success",
          "Waiting for updated",
          "success",
          "top",
          "accent",
        );
      }
    } catch (error) {
      showToast(
        "Create Post Failed",
        "Please try again or contact customer support",
        "error",
        "top",
        "accent",
      );
      console.error("catch error on createPost", error);
    } finally {
      setLoading(false);
    }
  };
}
