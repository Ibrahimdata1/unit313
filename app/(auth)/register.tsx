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
import { z } from "zod";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useShowToast();
  const registerSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Please type email" })
      .email({ message: "Invalid Email Format" }),
    password: z
      .string()
      .min(6, { message: "Password must be atleast 6 charactors" }),
    name: z.string().min(1, { message: "Please type your name" }),
  });
  const handleRegister = async () => {
    const result = registerSchema.safeParse({ email, password, name });
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      showToast("Validation Error", errorMessage, "error", "top", "accent");
      return;
    }
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
        "SignUp Failed!",
        "Please try again or contact authority",
        "error",
        "top",
        "accent",
      );
      console.log("Registeration Failed", authError.message);
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
          "Please try again or contact authority",
          "error",
          "top",
          "accent",
        );
        console.log("Registeration Failed!", errSaveProfiles.message);
      } else {
        showToast(
          "Registeration Success!",
          "Check your email for the confirmation link",
          "success",
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
                    keyboardType="email-address"
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
