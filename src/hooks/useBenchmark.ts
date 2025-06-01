import {useState} from 'react';

import {BenchmarkStatus} from '../components/BenchmarkCard';
import saveBenchmarkRecords, {
  ExecutionEnvironment,
} from '../services/benchmark';
import {
  getStorageBenchmarks,
  StorageBenchmark,
  syncStorageBenchmark,
} from '../utils/storage';

const useBenchmark = () => {
  type Benchmark = {
    status: BenchmarkStatus;
    step: number;
  };

  const [isSyncing, setIsSyncing] = useState(false);

  const [benchmarks, setBenchmarks] = useState({
    local: {status: BenchmarkStatus.LOADING, step: -1},
    backend: {status: BenchmarkStatus.READY, step: -1},
  });

  const uploadBenchmark = async (storageBenchmark: StorageBenchmark) => {
    const {id, records, environment} = storageBenchmark;
    const status = await saveBenchmarkRecords(records, environment);
    if (status.success) {
      await syncStorageBenchmark(id);
    }
    return status;
  };

  const triggerSync = async () => {
    const storageBenchmarks = await getStorageBenchmarks();
    if (storageBenchmarks.length >= 1) {
      setIsSyncing(true);
      for (const benchmark of storageBenchmarks) {
        const status = await uploadBenchmark(benchmark);
        if (!status.success) {
          break;
        }
      }
      setIsSyncing(false);
    }
  };

  const updateBenchmarkField = <K extends keyof Benchmark>(
    environment: ExecutionEnvironment,
    key: K,
    value: Benchmark[K],
  ) => {
    setBenchmarks(prev => ({
      ...prev,
      [environment]: {
        ...prev[environment],
        [key]: value,
      },
    }));
  };

  const updateStatus = (
    environment: ExecutionEnvironment,
    status: BenchmarkStatus,
  ) => updateBenchmarkField(environment, 'status', status);

  const updateStep = (environment: ExecutionEnvironment, step: number) =>
    updateBenchmarkField(environment, 'step', step);

  return {benchmarks, isSyncing, triggerSync, updateStatus, updateStep};
};

export default useBenchmark;
