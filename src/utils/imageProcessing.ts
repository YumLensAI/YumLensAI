import {tensor3d} from '@tensorflow/tfjs';
import {BufferLike, decode} from 'jpeg-js';

export const base64ImageToBuffer = (base64: string) => {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const imageBufferToTensor = (imageBuffer: BufferLike) => {
  const {width, height, data} = decode(imageBuffer, {
    useTArray: true,
  });

  const buffer = new Uint8Array(width * height * 3);
  let offset = 0;
  for (let i = 0; i < buffer.length; i += 3) {
    buffer[i] = data[offset];
    buffer[i + 1] = data[offset + 1];
    buffer[i + 2] = data[offset + 2];

    offset += 4;
  }

  return tensor3d(buffer, [height, width, 3]);
};
