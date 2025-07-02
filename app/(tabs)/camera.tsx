import React, { useRef, useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { CameraView, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { useRouter, useFocusEffect } from 'expo-router';
import { useStore } from '@/store';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(true);
  const cameraRef = useRef<any>(null);
  const addItem = useStore((state) => state.addItem);
  const router = useRouter();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // 👇 Reactivate camera when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setCameraActive(true);
      return () => setCameraActive(false);
    }, [])
  );

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync();
      addItem(photo.uri);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {cameraActive ? (
        <CameraView ref={cameraRef} style={{ flex: 1 }} />
      ) : (
        <View style={{ flex: 1, backgroundColor: 'black' }} />
      )}
      <View style={styles.controls}>
        <Button title="Snap" onPress={takePicture} />
        <Button title="Go to Scanned" onPress={() => router.push('/(tabs)/scanned')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
