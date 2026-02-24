import { ROLE_OPTIONS } from "@/constants/roleOptions";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/types/databaseUserRole";
import { useShowToast } from "@/utils/useShowToast";
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

export default function RoleSelection() {
  const router = useRouter();
  const { showToast } = useShowToast();
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
      const { error } = await supabase
        .from("profiles")
        .update({
          id: user.id,
          is_investor: selectedRole.is_investor,
          is_entrepreneur: selectedRole.is_entrepreneur,
          is_jobseeker: selectedRole.is_jobseeker,
        })
        .eq("id", user.id);
      if (error) {
        showToast(
          "Error when saving your role",
          "Please contact customer service",
          "error",
          "top",
          "accent",
        );
        console.log("error saving role user", error.message);
        return;
      }
      router.push("/(tabs)/dashboard");
    } catch (error) {
      showToast(
        "something wrong",
        "cannot save please try again",
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
