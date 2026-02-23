import { fetchContentByRole } from "@/services/fetchContentRole";
import { fetchUserRole } from "@/services/fetchUserRole";
import { UserRole } from "@/types/database";
import {
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
    ScrollView,
    Spinner,
    Text,
    VStack,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function DashboardScreen() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [dataByRole, setDataByRole] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const loadAllData = async () => {
      const userRole = await fetchUserRole();
      setRole(userRole);
      const dataRole = await fetchContentByRole(userRole);
      setDataByRole(dataRole);
      setLoading(false);
    };
    loadAllData();
  }, []);
  return (
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
      </Box>
      <ScrollView>
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
            dataByRole.map((data) => (
              <Box
                key={data.id}
                p="$5"
                bg="$white"
                borderRadius="$xl"
                softShadow="2"
              >
                <VStack space="sm">
                  <HStack justifyContent="space-between" alignItems="center">
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
                  <Text size="sm" color="$textLight600" numberOfLines={2}>
                    {data.content}
                  </Text>
                  <Button
                    mt="$4"
                    size="sm"
                    variant="solid"
                    action="primary"
                    bg="$success600"
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/postDetails",
                        params: { id: data.id },
                      })
                    }
                  >
                    <ButtonText>Check Details</ButtonText>
                  </Button>
                </VStack>
              </Box>
            ))
          ) : (
            //if no data
            <Box py="$20" alignItems="center">
              <Text color="$textLight500">No posts found for your role.</Text>
            </Box>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
}
