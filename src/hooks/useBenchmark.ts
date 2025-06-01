import {useState} from 'react';
import {BenchmarkStatus} from '../components/BenchmarkCard';
import {ExecutionEnvironment} from '../services/benchmark';

const useBenchmark = () => {
  type Benchmark = {
    status: BenchmarkStatus;
    step: number;
  };

  const [benchmarks, setBenchmarks] = useState({
    local: {status: BenchmarkStatus.LOADING, step: -1},
    backend: {status: BenchmarkStatus.READY, step: -1},
  });

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

  const updateStep = (
    environment: ExecutionEnvironment,
    step: number,
  ) => updateBenchmarkField(environment, 'step', step);

  return {benchmarks, updateStatus, updateStep};
};

export default useBenchmark;
