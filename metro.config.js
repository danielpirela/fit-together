import { getDefaultConfig } from "expo/metro-config";
import { withNativewind } from "nativewind/metro";

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withNativewind(config, {
  inlineVariables: false,
  globalClassNamePolyfill: false,
});