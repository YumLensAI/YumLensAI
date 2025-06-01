import modelWeights from '../constants/modelWeights';

type TypedArray =
  | Float32Array
  | Float64Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | BigInt64Array
  | BigUint64Array;

export const getClassNames = (
  scores: TypedArray,
  numClasses = 7,
  threshold = 0.7,
) => {
  const results = new Set<string>();

  for (let i = 0; i < scores.length; i += numClasses) {
    const classScores = new Array(numClasses);

    for (let j = 0; j < numClasses; j++) {
      classScores[j] = scores[i + j];
    }

    let confidence = classScores[0];
    let classId = 0;

    for (let k = 1; k < classScores.length; k++) {
      if (classScores[k] > confidence) {
        confidence = classScores[k];
        classId = k;
      }
    }

    if (confidence > threshold) {
      results.add(modelWeights[classId]);
    }
  }

  return Array.from(results);
};
