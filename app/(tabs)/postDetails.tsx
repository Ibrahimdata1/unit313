import { supabase } from "@/lib/supabase";
import { useShowToast } from "@/utils/useShowToast";
import {
    Box,
    Button,
    ButtonText,
    ChevronLeftIcon,
    Divider,
    Heading,
    HStack,
    Icon,
    Image,
    Pressable,
    ScrollView,
    Spinner,
    Text,
    TrashIcon,
    View,
    VStack,
} from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function PostDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { showToast } = useShowToast();
  const [post, setPost] = useState<any>(null);
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
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </Box>
    );
  }
  if (!post) {
    return <Text>404 Post is not here</Text>;
  }
  return (
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <Box flex={1} bg="$white">
        <HStack
          p="$4"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="$borderLight100"
        >
          <Pressable onPress={() => router.back()}>
            <Icon as={ChevronLeftIcon} size="xl" color="$black" />
          </Pressable>
          <Heading size="md" ml="$4">
            post details
          </Heading>
        </HStack>

        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          {post.image_url && post.image_url.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              p="$4"
            >
              <HStack space="md">
                {post.image_url.map((url: string, index: number) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    alt={`post-image-${index}`}
                    w={300}
                    h={300}
                    borderRadius={12}
                    resizeMode="cover"
                  />
                ))}
              </HStack>
            </ScrollView>
          ) : (
            <Box
              h={200}
              bg="$secondary100"
              justifyContent="center"
              alignItems="center"
              m="$4"
              borderRadius="$lg"
            >
              <Text color="$secondary500">Pictures not exists</Text>
            </Box>
          )}

          <VStack p="$5" space="lg">
            <Box
              bg="$primary100"
              alignSelf="flex-start"
              px="$3"
              py="$1"
              borderRadius="$full"
            >
              <Text size="xs" color="$primary700" fontWeight="$bold">
                {post.category}
              </Text>
            </Box>

            <Heading size="xl">{post.title}</Heading>
            <Text size="xs" color="$textLight500">
              Posted on: {new Date(post.created_at).toLocaleDateString()}
            </Text>
            <Text size="md" color="$text700" lineHeight="$xl">
              {post.content}
            </Text>

            <Divider my="$4" />

            {/* Milestones Section */}
            <Heading size="md" mb="$2">
              Our Roadmap(Milestones)
            </Heading>
            <VStack space="md">
              {post.milestones?.map((item: any, index: number) => (
                <HStack key={index} space="sm" alignItems="flex-start">
                  <Box
                    w={24}
                    h={24}
                    borderRadius="$full"
                    bg={item.is_done ? "$success500" : "$secondary200"}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text size="xs" color="$white">
                      {index + 1}
                    </Text>
                  </Box>
                  <Text flex={1} size="md" strikeThrough={item.is_done}>
                    {item.step}
                  </Text>
                </HStack>
              ))}
            </VStack>

            {isAuthor && (
              <Button
                mt="$10"
                action="negative"
                variant="outline"
                onPress={handleDelete}
                borderColor="$red500"
              >
                <Icon as={TrashIcon} color="$red500" mr="$2" size="sm" />
                <ButtonText color="$red500">Delete Post</ButtonText>
              </Button>
            )}
          </VStack>
        </ScrollView>
      </Box>
    </View>
  );
}
