@echo off
REM HybridMeshChat - Build Script for Command Prompt
REM This script runs the EAS build commands

echo.
echo ========================================
echo   HybridMeshChat - Cloud Build
echo ========================================
echo.

echo Step 1: Login to Expo
echo ----------------------
echo.
echo You will be asked for your Expo account credentials.
echo If you don't have an account, press Ctrl+C and run: eas register
echo.
pause

call eas login

echo.
echo ========================================
echo.

echo Step 2: Build Your App
echo -----------------------
echo.
echo This will build your app in the cloud (10-15 minutes)
echo You can close this window after the upload completes.
echo.
pause

call eas build --platform android --profile preview

echo.
echo ========================================
echo   Build Started!
echo ========================================
echo.
echo Check your build status at: https://expo.dev
echo You'll get a download link when the build completes.
echo.
pause
