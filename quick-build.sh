#!/bin/bash

# HybridMeshChat - Quick Build Script
# This script builds and installs the native Android app

echo "🚀 HybridMeshChat - Native Build"
echo "================================"
echo ""

# Check if phone is connected
echo "📱 Checking for connected devices..."
adb devices -l

echo ""
echo "⚠️  Make sure your phone is connected via USB with USB Debugging enabled!"
echo ""
read -p "Press Enter to continue with build..."

echo ""
echo "🔨 Building and installing native app..."
echo "This will take 3-5 minutes on first build..."
echo ""

# Build and install
npx expo run:android

echo ""
echo "✅ Build complete!"
echo ""
echo "📱 The app should now be running on your phone."
echo ""
echo "Next steps:"
echo "1. Test the app opens correctly"
echo "2. Try connecting to a room"
echo "3. Set up hotspot mode (see SIMPLE_HOTSPOT_SETUP.md)"
echo ""
