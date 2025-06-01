import {useEffect, useState} from 'react';

import RNFS from 'react-native-fs';

const baseCacheDir = RNFS.CachesDirectoryPath;
const datasetFolder = 'datasets';
const testSubfolder = 'test';

const cacheDir = `${baseCacheDir}/${datasetFolder}/${testSubfolder}/`;

const getImageFileName = (index: number) => {
  return `img${String(index).padStart(3, '0')}.jpg`;
};

const useTestDataset = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const prepareAllTestImages = async () => {
    try {
      await RNFS.mkdir(cacheDir);

      for (let i = 1; i <= 112; i++) {
        const filename = getImageFileName(i);
        const destPath = `${cacheDir}${filename}`;

        await RNFS.copyFileAssets(`images/${filename}`, destPath);
      }
    } catch (error) {
      throw error;
    }
  };

  const getImageUri = (index: number) => {
    const filename = getImageFileName(index);
    const imageUri = `file://${cacheDir}${filename}`;
    return imageUri;
  };

  useEffect(() => {
    prepareAllTestImages().then(() => setIsLoaded(true));
  }, []);

  return {isLoaded, getImageUri};
};

export default useTestDataset;
