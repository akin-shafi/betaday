// types/global.d.ts
interface Window {
    MSStream?: unknown; // Optional, as it's only present in some browsers (IE/Edge)
  }
  
  declare global {
    interface Navigator {
      standalone?: boolean; // Optional, used for iOS PWA detection
    }
  }
  
  export {};