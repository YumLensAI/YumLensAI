import {decodeJpeg} from '@tensorflow/tfjs-react-native';

export const base64ImageToTensor = (base64: string) => {
  const base64Decoded = atob(base64);
  const byteArray = base64Decoded.split('').map(char => char.charCodeAt(0));
  const imageBytes = Uint8Array.from(byteArray);
  const tensor = decodeJpeg(imageBytes);
  return tensor;
};
