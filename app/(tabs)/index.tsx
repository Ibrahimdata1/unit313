import { supabase } from "@/lib/supabase";
import { fetchContentByRole } from "@/services/fetchContentRole";
import { fetchUserRole } from "@/services/fetchUserRole";
import { UserRole } from "@/types/databaseUserRole";
import { useShowToast } from "@/utils/useShowToast";
import {
  AddIcon,
  Avatar,
  AvatarFallbackText,
  Badge,
  BadgeText,
  Box,
  Button,
  ButtonText,
  Center,
  Heading,
  HStack,
  Icon,
  Image,
  RefreshControl,
  ScrollView,
  Spinner,
  Text,
  View,
  VStack,
} from "@gluestack-ui/themed";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const { showToast } = useShowToast();
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<UserRole | null>(null);
  const [dataByRole, setDataByRole] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const userRole = await fetchUserRole();
      setRole(userRole);
      const dataRole = await fetchContentByRole(userRole);
      setDataByRole(dataRole);
    } catch (error) {
      console.error("loadAllData Error", error);
      showToast(
        "Loading Failed",
        "Please close and APP and open again",
        "error",
        "top",
        "accent",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      loadAllData();
    }, [loadAllData]),
  );
  return (
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <Box flex={1} bg="$secondary50">
        <Box
          p="$6"
          bg="$white"
          borderBottomWidth={1}
          borderBottomColor="$secondary200"
        >
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Heading size="xl" color="$success700">
                Unit313
              </Heading>
              <HStack space="xs">
                {role?.is_investor && (
                  <Badge action="success" size="sm">
                    <BadgeText>Investor</BadgeText>
                  </Badge>
                )}
                {role?.is_jobseeker && (
                  <Badge action="info" size="sm">
                    <BadgeText>Job Seeker</BadgeText>
                  </Badge>
                )}
                {role?.is_entrepreneur && (
                  <Badge action="warning" size="sm">
                    <BadgeText>Entrepreneur</BadgeText>
                  </Badge>
                )}
              </HStack>
            </VStack>
            <Avatar bgColor="$success500" size="md" borderRadius="$full">
              <AvatarFallbackText>KB</AvatarFallbackText>
            </Avatar>
          </HStack>
          <Button
            mt="$4"
            size="md"
            variant="outline"
            action="primary"
            onPress={() => router.push("/(tabs)/createPost")}
          >
            <ButtonText>Create New Post</ButtonText>
            <Icon as={AddIcon} ml="$2" />
          </Button>
        </Box>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadAllData}
              tintColor="transparent"
              colors={["transparent"]}
            />
          }
        >
          <VStack p="$4" space="md">
            {loading ? (
              <Center h="$40">
                <VStack space="md" alignItems="center">
                  <Spinner size="large" color="$success600" />
                  <Text size="sm" color="$textLight500">
                    Loading Data...
                  </Text>
                </VStack>
              </Center>
            ) : dataByRole.length > 0 ? (
              dataByRole.map((data) => {
                const {
                  data: { publicUrl },
                } = supabase.storage
                  .from("post-images")
                  .getPublicUrl(`${data.id}/0.jpg`);
                return (
                  <Box
                    key={data.id}
                    p="$5"
                    bg="$white"
                    borderRadius="$xl"
                    softShadow="2"
                    mb="$4"
                    overflow="hidden"
                  >
                    <Box h={180} w="$full">
                      <Image
                        source={{ uri: publicUrl }}
                        alt="Post Image"
                        size="full"
                        resizeMode="cover"
                      />
                    </Box>
                    <VStack space="sm">
                      <HStack
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Badge
                          size="md"
                          variant="outline"
                          borderRadius="$full"
                          action="info"
                        >
                          <BadgeText>{data.category}</BadgeText>
                        </Badge>
                        <Text size="xs" color="$textLight500">
                          {data.profiles?.full_name}
                        </Text>
                      </HStack>
                      <Heading size="md" mt="$2" color="$secondary900">
                        {data.title}
                      </Heading>
                      <Button
                        mt="$4"
                        size="sm"
                        variant="solid"
                        action="primary"
                        bg="$success600"
                        onPress={() =>
                          router.push(
                            `/(tabs)/postDetails?id=${data.id}` as any,
                          )
                        }
                      >
                        <ButtonText>Check Details</ButtonText>
                      </Button>
                    </VStack>
                  </Box>
                );
              })
            ) : (
              //if no data
              <Box py="$20" alignItems="center">
                <Text color="$textLight500">No posts found for your role.</Text>
              </Box>
            )}
          </VStack>
        </ScrollView>
      </Box>
    </View>
  );
}
