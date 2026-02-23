import { supabase } from "@/lib/supabase";
import { useShowToast } from "@/utils/useShowToast";
import {
    Box,
    Button,
    ButtonText,
    Center,
    FormControl,
    Heading,
    Input,
    InputField,
    InputIcon,
    InputSlot,
    Text,
    VStack,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { Lock, Mail, User } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useShowToast();
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      showToast(
        "Password do not match!",
        "Please make sure both are the same",
        "error",
        "top",
        "accent",
      );
      return;
    }
    setLoading(true);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) {
      showToast(
        "Registeration Failed!",
        authError.message,
        "error",
        "top",
        "accent",
      );
      setLoading(false);
      return;
    }
    if (user) {
      const { error: errSaveProfiles } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            full_name: name,
          },
        ]);
      if (errSaveProfiles) {
        showToast(
          "Registeration Failed!",
          errSaveProfiles.message,
          "error",
          "top",
          "accent",
        );
      } else {
        showToast(
          "Registeration Success!",
          "Check your email for the confirmation link",
          "error",
          "top",
          "accent",
        );
        router.replace("/login");
      }
    }
    setLoading(false);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Center flex={1} bg="$white" p="$4">
        <Box
          maxWidth="$96"
          width="100%"
          p="$6"
          borderRadius="$lg"
          borderWidth="$1"
          borderColor="$borderLight200"
          bg="$backgroundCard"
        >
          <VStack space="xl">
            <VStack space="xs">
              <Heading size="xl" color="$text900">
                Create Account
              </Heading>
              <Text size="sm" color="$text500">
                Join Unit313
              </Text>
            </VStack>
            <VStack space="md">
              <FormControl>
                <Input variant="outline" size="md">
                  <InputSlot pl="$3">
                    <InputIcon as={Mail} color="$text500" />
                  </InputSlot>
                  <InputField
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                </Input>
              </FormControl>
              <FormControl>
                <Input variant="outline" size="md">
                  <InputSlot pl="$3">
                    <InputIcon as={Lock} color="$text500" />
                  </InputSlot>
                  <InputField
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    type="password"
                    autoCapitalize="none"
                  />
                </Input>
              </FormControl>
              <FormControl>
                <Input variant="outline" size="md">
                  <InputSlot pl="$3">
                    <InputIcon as={Lock} color="$text500" />
                  </InputSlot>
                  <InputField
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    type="password"
                    autoCapitalize="none"
                  />
                </Input>
              </FormControl>
              <FormControl>
                <Input variant="outline" size="md">
                  <InputSlot pl="$3">
                    <InputIcon as={User} color="$text500" />
                  </InputSlot>
                  <InputField
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                  />
                </Input>
              </FormControl>
            </VStack>
            <Button
              variant="solid"
              onPress={handleRegister}
              action="primary"
              bg="$black"
              isDisabled={loading}
            >
              {loading ? (
                <ButtonText>Processing...</ButtonText>
              ) : (
                <ButtonText color="$white">Register</ButtonText>
              )}
            </Button>
            <Button
              variant="link"
              onPress={() => router.replace("/(auth)/login")}
            >
              <ButtonText size="sm">
                Already have an account? Sign In
              </ButtonText>
            </Button>
            <Text size="xs" color="$text400" textAlign="center">
              Unit 313 one ummah
            </Text>
          </VStack>
        </Box>
      </Center>
    </TouchableWithoutFeedback>
  );
}
