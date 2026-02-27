import { supabase } from "@/lib/supabase";
import { fetchUserRole } from "@/services/fetchUserRole";
import { UserRole } from "@/types/databaseUserRole";
import { useShowToast } from "@/utils/useShowToast";
import {
    Avatar,
    AvatarFallbackText,
    Badge,
    BadgeText,
    Box,
    Button,
    ButtonText,
    Divider,
    Heading,
    HStack,
    Icon,
    Link,
    LinkText,
    ScrollView,
    Spinner,
    Text,
    VStack,
} from "@gluestack-ui/themed";
import { decode } from "base64-arraybuffer";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import {
    BriefcaseIcon,
    FileTextIcon,
    LogOutIcon,
    TrendingUpIcon,
    UserIcon,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useShowToast();
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const invCapacity = profile?.investor?.investment_capacity || "Not specified";
  const invSector = profile?.investor?.interest_sector || "Not specified";
  const entCapacity =
    profile?.entrepreneur?.investment_capacity || "Not specified";
  const entBusinessPlan = profile?.entrepreneur?.business_plan_url || null;
  const jobSkills = profile?.jobseeker?.skills || "Not specified";
  const jobSalary = profile?.jobseeker?.expected_salary || "Not specified";
  const jobResume = profile?.jobseeker?.resume_url || null;
  const fetchProfile = async () => {
    const {
      data: { user },
      error: fetchUserError,
    } = await supabase.auth.getUser();
    if (!user) {
      throw new TypeError("User Error");
    }
    if (fetchUserError) {
      showToast(
        "Failed to fetch data",
        "Please contact customer support or refresh app",
        "error",
        "top",
        "accent",
      );
      throw fetchUserError;
    }
    const { data, error: fetchProfileError } = await supabase
      .from("profiles")
      .select(
        `
    *, 
    investor (
      investment_capacity,
      interest_sector
    ),
    entrepreneur(
    company_name,
    business_plan_url),
    jobseeker(
    resume_url,skills,expected_salary)
  `,
      )
      .eq("id", user.id)
      .single();
    if (fetchProfileError) {
      showToast(
        "Failed to fetch data",
        "Please contact customer support or refresh app",
        "error",
        "top",
        "accent",
      );
      throw fetchProfileError;
    }
    setProfile(data);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchProfile();
        const data = await fetchUserRole();
        setRole(data);
      } catch (error) {
        console.error("Profile load error:", error);
        showToast(
          "Profile load error",
          "Please try again",
          "error",
          "top",
          "accent",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleUploadResume = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      if (result.canceled) {
        setLoading(false);
        return;
      }
      const fileUri = result.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: "base64",
      });
      const arrayBuffer = decode(base64);
      const fileName = `resume-${profile.id}-${Date.now()}.pdf`;
      const { error: UploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, arrayBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });
      if (UploadError) {
        showToast(
          "Upload Failed!",
          "Please try again or contact admin",
          "error",
          "top",
          "accent",
        );
        throw UploadError;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(fileName);
      const { error: dbError } = await supabase.from("jobseeker").upsert({
        id: profile.id,
        resume_url: publicUrl,
      });
      if (dbError) {
        showToast(
          "Upload Failed!",
          "Please try again or contact admin",
          "error",
          "top",
          "accent",
        );
        throw dbError;
      }
      showToast(
        "Success",
        "Resume uploaded successfully!",
        "success",
        "top",
        "accent",
      );
    } catch (error) {
      console.error("Upload error:", error);
      showToast(
        "Upload Failed",
        "Could not upload resume",
        "error",
        "top",
        "accent",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };
  if (loading) {
    return (
      <Box flex={1} bg="$white" justifyContent="center" alignItems="center">
        <Spinner size="large" color="$primary500" />
        <Text mt="$4" color="$textLight500">
          Loading profile...
        </Text>
      </Box>
    );
  }
  if (!profile) {
    return (
      <Box flex={1} bg="$white" justifyContent="center" alignItems="center">
        <Text>No profile data found.</Text>
      </Box>
    );
  }
  return (
    <Box flex={1} bg="$secondary50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <Box
        p="$4"
        bg="$white"
        borderBottomWidth={1}
        borderColor="$borderLight100"
      >
        <Heading size="xl" textAlign="center">
          My Profile
        </Heading>
      </Box>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <VStack
          bg="$white"
          p="$6"
          space="md"
          alignItems="center"
          borderBottomWidth={1}
          borderColor="$borderLight100"
        >
          <Avatar size="2xl" bgColor="$primary500">
            <AvatarFallbackText>
              {profile.full_name || "User"}
            </AvatarFallbackText>
          </Avatar>

          <Heading size="lg">{profile.full_name || "Unknown Name"}</Heading>

          {/* แสดง Badges ตาม Role ที่ผู้ใช้มี */}
          <HStack space="sm" flexWrap="wrap" justifyContent="center">
            {role?.is_investor && (
              <Badge action="success" variant="solid" borderRadius="$full">
                <BadgeText>Investor</BadgeText>
              </Badge>
            )}
            {role?.is_jobseeker && (
              <Badge action="info" variant="solid" borderRadius="$full">
                <BadgeText>Job Seeker</BadgeText>
              </Badge>
            )}
            {role?.is_entrepreneur && (
              <Badge action="warning" variant="solid" borderRadius="$full">
                <BadgeText>Entrepreneur</BadgeText>
              </Badge>
            )}
          </HStack>
        </VStack>

        <VStack p="$4" space="lg">
          {/* Section: Investor */}
          {role?.is_investor && (
            <Box bg="$white" p="$5" borderRadius="$xl" softShadow="1">
              <HStack space="md" alignItems="center" mb="$3">
                <Icon as={TrendingUpIcon} color="$success600" size="xl" />
                <Heading size="md" color="$success700">
                  Investor Profile
                </Heading>
              </HStack>
              <Divider mb="$3" />
              <VStack space="sm">
                <Text size="sm" color="$textLight500">
                  Investment Capacity
                </Text>
                <Text size="md" fontWeight="$medium">
                  {invCapacity}
                </Text>

                <Text size="sm" color="$textLight500" mt="$2">
                  Interest Sector
                </Text>
                <Text size="md" fontWeight="$medium">
                  {invSector}
                </Text>
              </VStack>
            </Box>
          )}

          {/* Section: Entrepreneur */}
          {role?.is_entrepreneur && (
            <Box bg="$white" p="$5" borderRadius="$xl" softShadow="1">
              <HStack space="md" alignItems="center" mb="$3">
                <Icon as={BriefcaseIcon} color="$warning600" size="xl" />
                <Heading size="md" color="$warning700">
                  Entrepreneur Profile
                </Heading>
              </HStack>
              <Divider mb="$3" />
              <VStack space="sm">
                <Text size="sm" color="$textLight500">
                  Capital / Capacity
                </Text>
                <Text size="md" fontWeight="$medium">
                  {entCapacity}
                </Text>

                <Text size="sm" color="$textLight500" mt="$2">
                  Business Plan
                </Text>
                {entBusinessPlan ? (
                  <Link href={entBusinessPlan} isExternal>
                    <HStack alignItems="center" mt="$1">
                      <Icon
                        as={FileTextIcon}
                        mr="$2"
                        size="sm"
                        color="$primary600"
                      />
                      <LinkText
                        size="sm"
                        color="$primary600"
                        fontWeight="$medium"
                        textDecorationLine="none"
                      >
                        View Document
                      </LinkText>
                    </HStack>
                  </Link>
                ) : (
                  <Button
                    mt="$2"
                    size="sm"
                    variant="outline"
                    action="primary"
                    alignSelf="flex-start"
                    onPress={() => {
                      console.log("Pressed Upload Business Plan");
                      //not finished building yet
                    }}
                  >
                    <ButtonText>Upload Document</ButtonText>
                  </Button>
                )}
              </VStack>
            </Box>
          )}

          {/* Section: Job Seeker */}
          {role?.is_jobseeker && (
            <Box bg="$white" p="$5" borderRadius="$xl" softShadow="1">
              <HStack space="md" alignItems="center" mb="$3">
                <Icon as={UserIcon} color="$info600" size="xl" />
                <Heading size="md" color="$info700">
                  Job Seeker Profile
                </Heading>
              </HStack>
              <Divider mb="$3" />
              <VStack space="sm">
                <Text size="sm" color="$textLight500">
                  Skills
                </Text>
                <Text size="md" fontWeight="$medium">
                  {jobSkills}
                </Text>

                <Text size="sm" color="$textLight500" mt="$2">
                  {jobSalary}
                </Text>
                <Text size="md" fontWeight="$medium">
                  Job Resume
                </Text>

                {jobResume ? (
                  <Link href={jobResume} isExternal>
                    <HStack alignItems="center" mt="$1">
                      <Icon
                        as={FileTextIcon}
                        mr="$2"
                        size="sm"
                        color="$primary600"
                      />
                      <LinkText
                        size="sm"
                        color="$primary600"
                        fontWeight="$medium"
                        textDecorationLine="none"
                      >
                        View Resume
                      </LinkText>
                    </HStack>
                  </Link>
                ) : (
                  <Button
                    mt="$2"
                    size="sm"
                    variant="outline"
                    action="primary"
                    alignSelf="flex-start"
                    onPress={handleUploadResume}
                  >
                    <ButtonText>Upload Resume</ButtonText>
                  </Button>
                )}
              </VStack>
            </Box>
          )}
        </VStack>

        <VStack p="$4" mt="$4">
          <Button
            size="lg"
            action="negative"
            variant="outline"
            onPress={handleLogout}
            borderColor="$red500"
          >
            <Icon as={LogOutIcon} color="$red500" mr="$2" />
            <ButtonText color="$red500">Log Out</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}
