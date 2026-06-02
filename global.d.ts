/// <reference types="react-native" />
/// <reference types="react" />

// CSS module declarations
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}
