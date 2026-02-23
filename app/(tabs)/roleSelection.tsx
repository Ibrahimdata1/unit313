import { supabase } from "@/lib/supabase";
import { UserRole } from "@/types/database";
import { showToast } from "@/utils/showToast";
import {
    Box,
    Button,
    ButtonText,
    Heading,
    HStack,
    Pressable,
    Text,
    VStack,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { useState } from "react";

const ROLE_OPTIONS = [
  { id: "is_jobseeker", title: "Job Seeker", icon: "💼" },
  { id: "is_investor", title: "Investor", icon: "💰" },
  { id: "is_entrepreneur", title: "Entrepreneur", icon: "🚀" },
];
export default function RoleSelection() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>({
    is_jobseeker: false,
    is_investor: false,
    is_entrepreneur: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const toggleRole = (key: keyof UserRole) => {
    setSelectedRole((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const hasSelection =
    selectedRole.is_jobseeker ||
    selectedRole.is_investor ||
    selectedRole.is_entrepreneur;
  const handleConfirm = async () => {
    if (!selectedRole)
      showToast(
        "please selected role",
        "must have atleast one role",
        "error",
        "top",
        "accent",
      );
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        showToast(
          "User not found",
          "Please login first",
          "error",
          "top",
          "accent",
        );
        return;
      }
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        is_investor: selectedRole.is_investor,
        is_entrepreneur: selectedRole.is_entrepreneur,
        is_jobseeker: selectedRole.is_jobseeker,
      });
      if (error)
        showToast(
          "please selected any role",
          "must selected atleast one role",
          "error",
          "top",
          "accent",
        );
      router.replace("/(tabs)/dashboard");
    } catch (error) {
      showToast(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        "error",
        "top",
        "accent",
      );
      console.error("Role Selection Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box flex={1} bg="$white" p="$6" justifyContent="center">
      <VStack space="md" mb="$8">
        <Heading size="xl" textAlign="center">
          Who are you in Unit313?
        </Heading>
        <Text textAlign="center" color="$secondary600">
          You can select more than one role.
        </Text>
      </VStack>

      <VStack space="lg">
        {ROLE_OPTIONS.map((role) => {
          const isSelected = selectedRole[role.id as keyof UserRole];

          return (
            <Pressable
              key={role.id}
              onPress={() => toggleRole(role.id as keyof UserRole)}
            >
              <Box
                p="$4"
                rounded="$xl"
                borderWidth="$2"
                borderColor={isSelected ? "$primary500" : "$secondary200"}
                bg={isSelected ? "$primary50" : "$white"}
              >
                <HStack space="md" alignItems="center">
                  <Box bg="$secondary100" p="$3" rounded="$full">
                    <Text size="xl">{role.icon}</Text>
                  </Box>
                  <VStack flex={1}>
                    <Text fontWeight="$bold" size="lg">
                      {role.title}
                    </Text>
                    <Text size="sm" color="$secondary500">
                      Tap to select this role
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </Pressable>
          );
        })}
      </VStack>

      <Button
        mt="$10"
        size="lg"
        isDisabled={!hasSelection || loading}
        onPress={handleConfirm}
      >
        <ButtonText>
          {loading ? "Saving..." : "Confirm and Continue"}
        </ButtonText>
      </Button>
    </Box>
  );
}
