import 'dotenv/config';

export default {
  "expo": {
    "name": "my-app",
    "slug": "my-app",
    "version": "1.0.0",
    "owner": "team-tango",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    // "splash": {
    //   "image": "./assets/splash.png",
    //   "resizeMode": "cover",
    //   "backgroundColor": "#ffffff"
    // },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "tango-atsumare"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      cloudVisionApiKey: process.env.GOOGLE_CLOUD_VISION_API_KEY,
      "eas": {
        "projectId": "00bc8170-cc77-4137-8a08-6592c5c46dfe"
      }
    },
  }
}
