// This file should be removed or modified as it's causing conflicts
// The google object should be accessed directly from window.google, not imported

// Instead of exporting a google object, create a utility function to ensure the API is loaded
export function ensureGoogleMapsLoaded(): Promise<typeof google> {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve(window.google)
      } else {
        // Set up a timeout to prevent infinite waiting
        const timeout = setTimeout(() => {
          reject(new Error("Google Maps API failed to load"))
        }, 10000)
  
        // Check every 100ms if the API has loaded
        const checkLoaded = () => {
          if (window.google && window.google.maps && window.google.maps.places) {
            clearTimeout(timeout)
            resolve(window.google)
          } else {
            setTimeout(checkLoaded, 100)
          }
        }
        checkLoaded()
      }
    })
  }
  
  