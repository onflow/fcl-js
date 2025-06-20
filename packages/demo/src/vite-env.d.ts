/// <reference types="vite/client" />

// Type declaration for .cdc files with ?raw suffix
declare module "*.cdc?raw" {
  const content: string
  export default content
}
