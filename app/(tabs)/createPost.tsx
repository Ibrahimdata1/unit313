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
  Image,
  Input,
  InputField,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
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
  const [images, setImages] = useState<string[]>([]);
  const pickImage = async () => {
    if (images.length >= 5) {
      showToast(
        "Limit reached",
        "You can upload up to 5 images",
        "warning",
        "top",
        "accent",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...selectedUris]);
    }
  };
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
  const uploadImages = async (postId: string) => {
    const uploadPromises = images.map(async (uri, index) => {
      const fileName = `${postId}/${index}.jpg`;

      const response = await fetch(uri);
      const imgBlob = await response.blob();

      return supabase.storage.from("post-images").upload(fileName, imgBlob, {
        contentType: "image/jpeg",
        upsert: true,
      });
    });

    await Promise.all(uploadPromises);
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
      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            author_id: user.id,
            title: title,
            content: content,
            category: category,
            milestones: mileStones,
            status: "open",
          },
        ])
        .select()
        .single();
      if (error) {
        showToast(
          "Create Post Failed",
          "Please try again or contact customer support",
          "error",
          "top",
          "accent",
        );
        console.error("error insert posts db", error.message);
        return;
      } else {
        await uploadImages(data.id);
        showToast(
          "Create Post Success",
          "Waiting for updated",
          "success",
          "top",
          "accent",
        );
        router.push("/(tabs)");
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
              Category
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
                  <ButtonText size="xs" textAlign="center">
                    {item}
                  </ButtonText>
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
                    onChangeText={(text) => updateMileStone(text, index)}
                  />
                </Input>
                <Button
                  size="sm"
                  action="negative"
                  variant="link"
                  onPress={() => removeMileStone(index)}
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

          <VStack space="md" mt="$4">
            <Heading size="sm">Photos ({images.length}/5)</Heading>

            <HStack space="sm" flexWrap="wrap">
              {images.map((uri, index) => (
                <Box
                  key={index}
                  w={80}
                  h={80}
                  position="relative"
                  borderRadius="$sm"
                  overflow="hidden"
                >
                  <Image source={{ uri }} alt="preview image" size="full" />
                  <Button
                    size="xs"
                    action="negative"
                    position="absolute"
                    top={-5}
                    right={-5}
                    borderRadius="$full"
                    onPress={() =>
                      setImages(images.filter((_, i) => i !== index))
                    }
                    w={20}
                    h={20}
                    p={0}
                  >
                    <Icon as={TrashIcon} size="xs" color="$white" />
                  </Button>
                </Box>
              ))}

              {images.length < 5 && (
                <Button
                  onPress={pickImage}
                  variant="outline"
                  action="secondary"
                  w={80}
                  h={80}
                  borderStyle="dashed"
                >
                  <VStack alignItems="center">
                    <Icon as={AddIcon} />
                    <Text size="xs">Add</Text>
                  </VStack>
                </Button>
              )}
            </HStack>
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
