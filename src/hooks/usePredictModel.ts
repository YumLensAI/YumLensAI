import {useEffect, useMemo} from 'react';

import RNFS from 'react-native-fs';
import * as tf from '@tensorflow/tfjs';
import {fetch} from '@tensorflow/tfjs-react-native';
import {useTensorflowModel} from 'react-native-fast-tflite';

import {
  base64ImageToBuffer,
  getClassNames,
  imageBufferToTensor,
} from '../utils';

const initializeTensorFlowJS = () => {
  tf.ready().then(() => fetch(''));
};

const usePredictModel = () => {
  const fruitsModel = require('../assets/models/fruits.tflite');

  const plugin = useTensorflowModel(fruitsModel);
  const model = plugin.model;
  const state = plugin.state;

  const imgDimension = useMemo(() => model?.inputs[0].shape[1], [model]);

  const getLocalImageInference = async (filePath: string) => {
    try {
      const base64 = await RNFS.readFile(filePath, 'base64');

      const imageBuffer = base64ImageToBuffer(base64);
      const imageTensor = imageBufferToTensor(imageBuffer)
        .expandDims(0)
        .resizeBilinear([imgDimension!, imgDimension!])
        .div(255.0);

      const predictionResult = await model!?.run([imageTensor.dataSync()]);

      const result = getClassNames(predictionResult[1]);

      return result;
    } catch (err) {
      throw new Error('Error during local inference.');
    }
  };

  useEffect(initializeTensorFlowJS, []);

  return {getLocalImageInference, state};
};

export default usePredictModel;
