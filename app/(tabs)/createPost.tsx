import { supabase } from "@/lib/supabase";
import { CATEGORY_OPTIONS, CategoryPost } from "@/types/categoryPost";
import { Milestone } from "@/types/postMilestone";
import { useShowToast } from "@/utils/useShowToast";
import {
    AddIcon,
    Box,
    Button,
    ButtonText,
    Heading,
    HStack,
    Icon,
    Input,
    InputField,
    ScrollView,
    Text,
    VStack,
} from "@gluestack-ui/themed";
import { TrashIcon } from "lucide-react-native";
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
  return (
    <Box
      flex={1}
      bg="$white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <VStack space="xl">
          <Heading size="xl" color="$primary900">
            Create New Post
          </Heading>

          {/* Title Section */}
          <VStack space="xs">
            <Text size="sm" fontWeight="$bold">
              Title
            </Text>
            <Input variant="outline" size="md">
              <InputField
                placeholder="Ex. Looking for Halal business partner"
                value={title}
                onChangeText={setTitle}
              />
            </Input>
          </VStack>
          {/* Category Selection */}
          <VStack space="xs">
            <Text size="sm" fontWeight="$bold">
              I am an...
            </Text>
            <HStack space="sm">
              {CATEGORY_OPTIONS.map((item) => (
                <Button
                  key={item}
                  action={category === item ? "primary" : "secondary"}
                  variant={category === item ? "solid" : "outline"}
                  onPress={() => setCategory(item)}
                  flex={1}
                >
                  <ButtonText>{item}</ButtonText>
                </Button>
              ))}
            </HStack>
          </VStack>

          {/* Content Section */}
          <VStack space="xs">
            <Text size="sm" fontWeight="$bold">
              Content
            </Text>
            <Input variant="outline" size="md" style={{ height: 120 }}>
              <InputField
                multiline
                placeholder="Describe your project details..."
                value={content}
                onChangeText={setContent}
                textAlignVertical="top"
              />
            </Input>
          </VStack>

          {/* Milestone Section */}
          <VStack space="md">
            <Heading size="md">Milestones</Heading>

            {mileStones.map((item, index) => (
              <HStack key={index} space="sm" alignItems="center">
                <Text size="sm" color="$textLight500">
                  {index + 1}.
                </Text>
                <Input flex={1}>
                  <InputField
                    placeholder="E.g. Get Halal Certification"
                    value={item.step}
                    onChangeText={(text) => updateMileStone(text, index)} // ใช้ฟังก์ชันที่คุณเขียน
                  />
                </Input>
                <Button
                  size="sm"
                  action="negative"
                  variant="link"
                  onPress={() => removeMileStone(index)} // ใช้ฟังก์ชันที่คุณเขียน
                  isDisabled={mileStones.length === 1}
                >
                  <Icon as={TrashIcon} color="$red500" />
                </Button>
              </HStack>
            ))}

            <VStack space="sm" mt="$2">
              <Input variant="underlined">
                <InputField
                  placeholder="Type new step here..."
                  value={mileStoneInput}
                  onChangeText={setMileStoneInput}
                />
              </Input>
              <Button
                action="primary"
                variant="outline"
                size="sm"
                onPress={() => {
                  addMileStone();
                  setMileStoneInput("");
                }}
                isDisabled={!mileStoneInput.trim()}
              >
                <ButtonText>Add Milestone</ButtonText>
                <Icon as={AddIcon} ml="$2" />
              </Button>
            </VStack>
          </VStack>

          {/* Submit Button */}
          <Button
            size="lg"
            action="primary"
            onPress={handleSave}
            isDisabled={loading || !title || !content}
            mt="$6"
          >
            {loading ? (
              <ButtonText>Saving...</ButtonText>
            ) : (
              <ButtonText>Post Now</ButtonText>
            )}
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}
