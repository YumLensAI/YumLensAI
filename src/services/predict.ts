import api from '../constants/api';

const PREDICT_ENDPOINT = 'predict';

export const getImageInference = async (filePath: string) => {
  try {
    const fileName = filePath.split('/').pop();
    const fileType = 'image/jpeg';

    const formData = new FormData();
    formData.append('image', {
      uri: filePath,
      name: fileName,
      type: fileType,
    });

    const headers = {'Content-Type': 'multipart/form-data'};

    const response = await api.post(PREDICT_ENDPOINT, formData, {headers});
    return response.data;
  } catch (err) {
    throw new Error('Failed to process image.');
  }
};
