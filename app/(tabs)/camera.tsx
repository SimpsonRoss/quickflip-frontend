import { IconSymbol } from '@/components/ui/IconSymbol';
import { useStore } from '@/store';
import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<any>(null);
  const addItem = useStore((state) => state.addItem);
  const router = useRouter();
  
  const captureScale = useSharedValue(1);
  const captureOpacity = useSharedValue(1);
  const flashOpacity = useSharedValue(0);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Reactivate camera when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setCameraActive(true);
      return () => setCameraActive(false);
    }, [])
  );

  const animatedCaptureStyle = useAnimatedStyle(() => ({
    transform: [{ scale: captureScale.value }],
    opacity: captureOpacity.value,
  }));

  const animatedFlashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      
      // Button animation
      captureScale.value = withSpring(0.9, { duration: 150 });
      captureOpacity.value = withTiming(0.7, { duration: 150 });
      
      // Flash effect
      flashOpacity.value = withTiming(1, { duration: 100 }, () => {
        flashOpacity.value = withTiming(0, { duration: 200 });
      });

      try {
        // Haptic feedback
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        
        const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        await addItem(photo.uri);
        
        // Success haptic
        runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Error taking picture:', error);
        runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
      } finally {
        // Reset button animation
        captureScale.value = withSpring(1, { duration: 200 });
        captureOpacity.value = withTiming(1, { duration: 200 });
        setIsCapturing(false);
      }
    }
  };

  const navigateToScanned = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/scanned');
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
        <View style={styles.permissionContent}>
          <View style={styles.permissionIconContainer}>
            <IconSymbol name="camera.fill" size={64} color="#8E8E93" />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionDescription}>
            QuickFlip needs camera access to scan items for price estimation and inventory tracking.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.permissionButton,
              pressed && { opacity: 0.8 }
            ]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Enable Camera</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Camera View */}
      {cameraActive ? (
        <CameraView ref={cameraRef} style={styles.camera} />
      ) : (
        <View style={styles.cameraPlaceholder} />
      )}

      {/* Flash Overlay */}
      <Animated.View style={[styles.flashOverlay, animatedFlashStyle]} />

      {/* Top Controls */}
      <SafeAreaView style={styles.topControls}>
        <View style={styles.topControlsContent}>
          <Text style={styles.instructionText}>
            Position item in frame and tap to scan
          </Text>
        </View>
      </SafeAreaView>

      {/* Camera Controls */}
      <SafeAreaView style={styles.bottomControls}>
        <View style={styles.controlsContainer}>
          {/* View Scanned Button */}
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { opacity: 0.7 }
            ]}
            onPress={navigateToScanned}
          >
            <IconSymbol name="list.bullet" size={20} color="#FFFFFF" />
            <Text style={styles.secondaryButtonText}>View Scanned</Text>
          </Pressable>

          {/* Capture Button */}
          <AnimatedPressable
            style={[styles.captureButtonContainer, animatedCaptureStyle]}
            onPress={takePicture}
            disabled={isCapturing}
          >
            <View style={styles.captureButton}>
              <View style={styles.captureButtonInner}>
                {isCapturing ? (
                  <IconSymbol name="checkmark" size={32} color="#007AFF" />
                ) : (
                  <IconSymbol name="camera.fill" size={32} color="#007AFF" />
                )}
              </View>
            </View>
          </AnimatedPressable>

          {/* Placeholder for symmetry */}
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      {/* Scanning Frame Overlay */}
      <View style={styles.scanningFrame}>
        <View style={styles.frameCorner} />
        <View style={[styles.frameCorner, styles.frameCornerTopRight]} />
        <View style={[styles.frameCorner, styles.frameCornerBottomLeft]} />
        <View style={[styles.frameCorner, styles.frameCornerBottomRight]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#000',
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    pointerEvents: 'none',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topControlsContent: {
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  captureButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  placeholder: {
    width: 100, // Match the width of secondaryButton approximately
  },
  scanningFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 280,
    height: 280,
    marginTop: -140,
    marginLeft: -140,
    pointerEvents: 'none',
  },
  frameCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FFFFFF',
    borderWidth: 3,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    top: 0,
    left: 0,
  },
  frameCornerTopRight: {
    transform: [{ rotate: '90deg' }],
    top: 0,
    right: 0,
    left: 'auto',
  },
  frameCornerBottomLeft: {
    transform: [{ rotate: '-90deg' }],
    bottom: 0,
    top: 'auto',
    left: 0,
  },
  frameCornerBottomRight: {
    transform: [{ rotate: '180deg' }],
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
  },
});
