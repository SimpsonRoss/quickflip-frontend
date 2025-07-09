import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';

export const KeyboardTest: React.FC = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useKeyboardHandler({
    onStart: (event) => {
      'worklet';
      setIsKeyboardVisible(true);
      setKeyboardHeight(event.height);
    },
    onMove: (event) => {
      'worklet';
      setKeyboardHeight(event.height);
    },
    onEnd: () => {
      'worklet';
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keyboard Controller Test</Text>
      <Text style={styles.info}>
        Keyboard Visible: {isKeyboardVisible ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.info}>
        Keyboard Height: {keyboardHeight}px
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Type here to test keyboard"
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: 'white',
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
});

export default KeyboardTest;