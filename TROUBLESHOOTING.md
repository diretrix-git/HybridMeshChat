# 🔧 Troubleshooting Guide

## Common Errors and Fixes

### Error 1: PowerShell Script Execution Error

**Error:**
```
eas : File C:\Users\...\eas.ps1 cannot be loaded because running scripts is disabled
```

**Fix:**
Use Command Prompt instead of PowerShell:
1. Press Windows Key + R
2. Type `cmd` and press Enter
3. Navigate: `cd C:\Users\Krish\OneDrive\Desktop\OfflineLANChat`
4. Run: `eas login`

Or double-click `run-build.bat`

---

### Error 2: Android SDK Not Found

**Error:**
```
Failed to resolve the Android SDK path
'adb' is not recognized
```

**Fix:**
Use cloud build instead:
```bash
eas login
eas build --platform android --profile preview
```

No Android SDK needed!

---

### Error 3: EAS Login Issues

**Error:**
```
Authentication failed
Invalid credentials
```

**Fix:**
1. Make sure you have an Expo account
2. If not, run: `eas register`
3. Use your email and password (not GitHub credentials)
4. Check your email for verification

---

### Error 4: Build Configuration Error

**Error:**
```
app.json is invalid
Missing required fields
```

**Fix:**
Your app.json is already correct! But if you see this:
```bash
# Check configuration
npx expo-doctor

# Fix automatically
npx expo install --fix
```

---

### Error 5: Network/Upload Error

**Error:**
```
Failed to upload project
Network timeout
```

**Fix:**
1. Check your internet connection
2. Try again: `eas build --platform android --profile preview`
3. If still fails, check: https://status.expo.dev

---

### Error 6: Dependencies Error

**Error:**
```
Package not found
Module resolution failed
```

**Fix:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Or on Windows
rmdir /s /q node_modules
npm install
```

---

### Error 7: Git Not Initialized

**Error:**
```
Not a git repository
```

**Fix:**
Already fixed! ✅ Git is initialized.

---

### Error 8: Build Failed in Cloud

**Error:**
```
Build failed
Check logs for details
```

**Fix:**
```bash
# View build logs
eas build:list
eas build:view [build-id]

# Common fixes:
# 1. Check app.json is valid
# 2. Make sure all dependencies are in package.json
# 3. Try building again
```

---

## 🔍 Check Your Setup

Run these commands to verify everything:

### Check Node.js:
```bash
node --version
```
Should show: v20.x.x or higher

### Check npm:
```bash
npm --version
```
Should show: 10.x.x or higher

### Check EAS CLI:
```bash
eas --version
```
Should show: eas-cli/18.x.x

### Check Git:
```bash
git --version
```
Should show: git version 2.x.x

---

## 🚀 If Nothing Works

### Nuclear Option (Fresh Start):

```bash
# 1. Backup your src/ folder
# 2. Delete node_modules
rmdir /s /q node_modules

# 3. Delete package-lock.json
del package-lock.json

# 4. Reinstall everything
npm install

# 5. Try building again
eas login
eas build --platform android --profile preview
```

---

## 📱 Alternative: Local Build

If cloud build keeps failing, install Android SDK:

1. Download Android Studio: https://developer.android.com/studio
2. Install it (takes 15-20 minutes)
3. Set ANDROID_HOME environment variable
4. Restart terminal
5. Run: `npx expo run:android`

See `INSTALL_ANDROID_SDK.md` for details.

---

## 🆘 Still Having Issues?

### Check These:

1. **Internet Connection**
   - Make sure you're online
   - Try: `ping google.com`

2. **Expo Status**
   - Check: https://status.expo.dev
   - Make sure services are operational

3. **Project Directory**
   - Make sure you're in the right folder
   - Run: `pwd` (should show OfflineLANChat)

4. **Permissions**
   - Make sure you have write permissions
   - Try running terminal as administrator

---

## 📊 Quick Diagnostic

Run this to check everything:

```bash
# Check versions
node --version
npm --version
eas --version
git --version

# Check project
cd C:\Users\Krish\OneDrive\Desktop\OfflineLANChat
dir

# Check EAS login status
eas whoami
```

---

## 🎯 Most Common Issue: PowerShell

If you're using PowerShell and getting script errors:

**Solution:** Use Command Prompt (cmd) instead!

1. Windows Key + R
2. Type: `cmd`
3. Press Enter
4. Navigate to project
5. Run commands

Or just double-click `run-build.bat`!

---

## 📝 Error Reporting

If you need help, provide:
1. The exact error message
2. What command you ran
3. Your terminal output
4. Your operating system

---

**Most issues are solved by using Command Prompt instead of PowerShell!** ✅
