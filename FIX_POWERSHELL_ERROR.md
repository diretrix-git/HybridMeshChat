# 🔧 Fix PowerShell Script Execution Error

## The Problem

PowerShell is blocking the `eas` command because of execution policy restrictions.

Error message:
```
eas : File C:\Users\Krish\AppData\Roaming\npm\eas.ps1 cannot be loaded 
because running scripts is disabled on this system.
```

## ✅ Solution 1: Use Command Prompt (EASIEST!)

Instead of PowerShell, use Command Prompt (CMD):

### Steps:
1. **Press Windows Key + R**
2. **Type:** `cmd`
3. **Press Enter**
4. **Navigate to your project:**
   ```
   cd C:\Users\Krish\OneDrive\Desktop\OfflineLANChat
   ```
5. **Run the commands:**
   ```
   eas login
   eas build --platform android --profile preview
   ```

Command Prompt doesn't have the same restrictions as PowerShell!

---

## ✅ Solution 2: Fix PowerShell Execution Policy

If you want to keep using PowerShell:

### Steps:
1. **Open PowerShell as Administrator:**
   - Press Windows Key
   - Type "PowerShell"
   - Right-click "Windows PowerShell"
   - Select "Run as administrator"

2. **Run this command:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Type "Y" and press Enter** when asked to confirm

4. **Close and reopen PowerShell** (normal, not admin)

5. **Navigate to your project:**
   ```powershell
   cd C:\Users\Krish\OneDrive\Desktop\OfflineLANChat
   ```

6. **Run the commands:**
   ```powershell
   eas login
   eas build --platform android --profile preview
   ```

---

## ✅ Solution 3: Use npx (Alternative)

You can also run EAS through npx:

```bash
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

This bypasses the PowerShell script issue!

---

## 🎯 Recommended: Use Command Prompt (Solution 1)

It's the fastest and easiest solution. Just:

1. Open Command Prompt (Windows Key + R, type `cmd`)
2. Navigate to project: `cd C:\Users\Krish\OneDrive\Desktop\OfflineLANChat`
3. Run: `eas login`
4. Run: `eas build --platform android --profile preview`

Done! No PowerShell issues! 🚀

---

## 📝 Quick Reference

### Open Command Prompt:
- **Method 1:** Windows Key + R → type `cmd` → Enter
- **Method 2:** Windows Key → type `cmd` → Enter
- **Method 3:** In File Explorer, type `cmd` in address bar

### Navigate to Project:
```
cd C:\Users\Krish\OneDrive\Desktop\OfflineLANChat
```

### Run Commands:
```
eas login
eas build --platform android --profile preview
```

---

## 🆘 Still Having Issues?

Try the npx method:
```bash
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

This always works regardless of PowerShell settings!

---

**Bottom Line: Use Command Prompt instead of PowerShell!** ✅
