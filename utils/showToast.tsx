import {
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
    VStack,
} from "@gluestack-ui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const toast = useToast();
const space = useSafeAreaInsets();
export const showToast = (
  title: string,
  desc: string,
  action: "error" | "success",
  direction: "top" | "bottom",
  variant: "accent",
) => {
  toast.show({
    placement: direction,
    render: ({ id }) => (
      <Toast
        nativeID={id}
        action={action}
        variant={variant}
        style={{ marginTop: space.top }}
      >
        <VStack space="xs">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{desc}</ToastDescription>
        </VStack>
      </Toast>
    ),
  });
};
