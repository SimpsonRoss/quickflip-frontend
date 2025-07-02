import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

export interface DescribeImageResult {
  title: string;
  description: string;
  condition: string;
  estimatedPrice: number | null;
  priceCount: number;
}

export async function describeImage(
  imageUri: string
): Promise<DescribeImageResult> {
  try {
    // 🔧 Resize + compress before converting to Base64
    const compressed = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 800 } }], // max width 800px
      {
        compress: 0.8, // 80% quality
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    // Convert to Base64
    const base64 = await FileSystem.readAsStringAsync(compressed.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Call your backend describe endpoint
    const response = await fetch('https://quickflip-backend.vercel.app/api/describe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('❌ describeImage(): Backend returned error:\n', errorText);
      throw new Error('Failed to get description from OpenAI proxy');
    }

    const json = await response.json();
    console.log('✅ describeImage(): Success:\n', json);

    // Make sure all expected fields are present
    return {
      title: json.title,
      description: json.description,
      condition: json.condition,
      estimatedPrice: json.estimatedPrice,
      priceCount: json.priceCount,
    };
  } catch (err) {
    console.error('🔥 describeImage() threw error:\n', err);
    throw err;
  }
}
