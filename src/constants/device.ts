import DeviceInfo from 'react-native-device-info';

const getTotalRAMInGB = () => DeviceInfo.getTotalMemorySync() / 1024 ** 3;

export const model = `${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`;

export const os = `${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`;

export const memory = `${getTotalRAMInGB().toFixed(2)} GB`;
