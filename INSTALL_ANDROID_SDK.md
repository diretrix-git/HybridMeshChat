# 📱 Install Android SDK - Required for Building

## Current Issue

The Android SDK is not installed on your system. This is required to build Android apps.

## ✅ Easy Solution: Install Android Studio

### Option 1: Android Studio (Recommended - Easiest)

1. **Download Android Studio:**
   - Go to: https://developer.android.com/studio
   - Click "Download Android Studio"
   - Run the installer

2. **During Installation:**
   - ✅ Check "Android SDK"
   - ✅ Check "Android SDK Platform"
   - ✅ Check "Android Virtual Device" (optional)
   - Install to default location: `C:\Users\Krish\AppData\Local\Android\Sdk`

3. **After Installation:**
   - Open Android Studio
   - Go through the setup wizard
   - It will download SDK components automatically

4. **Set Environment Variable:**
   - Open "Environment Variables" (search in Windows)
   - Add new System Variable:
     - Name: `ANDROID_HOME`
     - Value: `C:\Users\Krish\AppData\Local\Android\Sdk`
   - Edit "Path" variable, add:
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\tools`

5. **Restart Terminal** and try again:
   ```bash
   npx expo run:android
   ```

### Option 2: SDK Command Line Tools Only (Advanced)

If you don't want Android Studio:

1. **Download SDK Command Line Tools:**
   - Go to: https://developer.android.com/studio#command-line-tools-only
   - Download "Command line tools only" for Windows

2. **Extract to:**
   ```
   C:\Users\Krish\AppData\Local\Android\Sdk\cmdline-tools\latest\
   ```

3. **Install SDK Components:**
   ```bash
   cd C:\Users\Krish\AppData\Local\Android\Sdk\cmdline-tools\latest\bin
   sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
   ```

4. **Set Environment Variables** (same as Option 1)

5. **Restart Terminal**

## ⚡ Quick Check After Installation

Open a NEW terminal and run:
```bash
adb version
```

Should show:
```
Android Debug Bridge version 1.0.41
```

Then try building again:
```bash
npx expo run:android
```

## 🎯 Recommended: Option 1 (Android Studio)

Android Studio is the easiest because:
- ✅ Installs everything automatically
- ✅ Sets up environment variables
- ✅ Includes useful tools
- ✅ Can use emulator for testing
- ✅ Official Google tool

**Download:** https://developer.android.com/studio

Installation time: 10-15 minutes

## 📱 Alternative: Use EAS Build (Cloud Build)

If you don't want to install Android SDK locally, you can build in the cloud:

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Build in Cloud:**
   ```bash
   eas build --platform android --profile development
   ```

4. **Download APK** when build completes

5. **Install on phone** via USB or download link

This builds the app on Expo's servers, so you don't need Android SDK installed!

## 🔧 Troubleshooting

### "ANDROID_HOME not set"
- Make sure you set the environment variable
- Restart your terminal/computer
- Check: `echo $env:ANDROID_HOME` (should show the path)

### "adb not found"
- Make sure platform-tools is in PATH
- Restart terminal
- Try: `C:\Users\Krish\AppData\Local\Android\Sdk\platform-tools\adb.exe version`

### "SDK not found"
- Make sure Android Studio completed setup
- Check folder exists: `C:\Users\Krish\AppData\Local\Android\Sdk`
- Re-run Android Studio setup wizard

## 🎯 Next Steps

1. **Install Android Studio** (recommended)
2. **Set ANDROID_HOME** environment variable
3. **Restart terminal**
4. **Run:** `npx expo run:android`

Or use EAS Build for cloud building!

---

**Estimated time:** 15-20 minutes for Android Studio installation
