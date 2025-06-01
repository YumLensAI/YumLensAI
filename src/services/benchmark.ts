import api from '../constants/api';

const LOCAL_ENDPOINT = 'benchmarks/local';
const BACKEND_ENDPOINT = 'benchmarks/backend';

export type ExecutionEnvironment = 'local' | 'backend';

export interface BenchmarkRecord {
  fileName: string;
  detectedObjects: string[];
  startTimestamp: number;
  endTimestamp: number;
  initialBattery: string;
  finalBattery: string;
  elapsedTime: number;
}

export const saveBenchmarkRecords = async (
  records: BenchmarkRecord[],
  environment: ExecutionEnvironment,
) => {
  try {
    const isLocalBenchmark = environment === 'local';
    const endpoint = isLocalBenchmark ? LOCAL_ENDPOINT : BACKEND_ENDPOINT;
    await api.post(endpoint, records);
    return {success: true};
  } catch (err) {
    return {success: false};
  }
};

export default saveBenchmarkRecords;
