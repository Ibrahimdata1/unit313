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
    VStack
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { supabase } from "../../lib/supabase";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useShowToast();
  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      showToast("Login Failed!", `${error.message}`, "error", "top", "accent");
      setLoading(false);
    } else {
      router.replace("/(tabs)/roleSelection" as any);
    }
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
            {/* heading section */}
            <VStack space="xs">
              <Heading size="xl" color="$text900">
                Unit313
              </Heading>
              <Text size="sm" color="$text500">
                Insert Email and Password for Login
              </Text>
            </VStack>
            <VStack space="md">
              <FormControl>
                <Input variant="outline" size="md">
                  <InputSlot pl="$3">
                    <InputIcon as={Mail} color="$text500" />
                  </InputSlot>
                  <InputField
                    placeholder="name@example.com"
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
                    type="password"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                  />
                </Input>
              </FormControl>
            </VStack>
            <Button
              size="lg"
              variant="solid"
              action="primary"
              bg="$black"
              onPress={handleLogin}
              isDisabled={loading}
            >
              {loading ? (
                <ButtonText>Loading....</ButtonText>
              ) : (
                <ButtonText color="$white">Sign in</ButtonText>
              )}
            </Button>
            <Button
              variant="link"
              onPress={() => router.push("/(auth)/register" as any)}
            >
              <ButtonText>Not Registerd Yet?</ButtonText>
            </Button>
            <Text size="xs" color="$text400" textAlign="center">
              Unit313 one ummah
            </Text>
          </VStack>
        </Box>
      </Center>
    </TouchableWithoutFeedback>
  );
}
