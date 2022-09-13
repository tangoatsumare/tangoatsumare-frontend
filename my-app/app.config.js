import 'dotenv/config';

export default {
  "expo": {
    "name": "my-app",
    "slug": "my-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
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
      firebaseApiKey: process.env.FIREBASE_APP_APIKEY,
      firebaseAuthDomain: process.env.FIREBASE_APP_AUTHDOMAIN,
      firebaseProjectId: process.env.FIREBASE_APP_PROJECTID,
      firebaseStorageBucket: process.env.FIREBASE_APP_STORAGEBUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_APP_MESSAGINGSENDERID,
      firebaseAppId: process.env.FIREBASE_APP_APPID
    }
  }
}
