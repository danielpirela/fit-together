import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import type { ComponentProps } from "react";
import { Platform } from "react-native";

type HrefProps = ComponentProps<typeof Link>;

export function ExternalLink({ href, ...props }: Omit<HrefProps, "href"> & { href: string }) {
  const handlePress = (e: { preventDefault: () => void }) => {
    if (Platform.OS !== "web") {
      e.preventDefault();
      WebBrowser.openBrowserAsync(href as string);
    }
  };

  return (
    <Link
      target="_blank"
      href={href as "/"}
      {...props}
      onPress={handlePress as HrefProps["onPress"]}
    />
  );
}
