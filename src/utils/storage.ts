import {MMKV} from 'react-native-mmkv';

import {BenchmarkRecord, ExecutionEnvironment} from '../services/benchmark';

const storage = new MMKV();

const BENCHMARKS_KEY = '@yumlensai-benchmarks';

export type StorageBenchmark = {
  id: string;
  environment: ExecutionEnvironment;
  records: BenchmarkRecord[];
};

const generateRandomId = () => Math.random().toString(36).slice(2, 11);

export const getStorageBenchmarks = () => {
  const benchmarksString = storage.getString(BENCHMARKS_KEY) ?? '';
  const benchmarks = benchmarksString ? JSON.parse(benchmarksString) : [];
  return benchmarks as StorageBenchmark[];
};

export const saveStorageBenchmark = async (
  records: BenchmarkRecord[],
  environment: string,
) => {
  const id = generateRandomId();
  const benchmarks = await getStorageBenchmarks();
  const updatedBenchmarks = [{id, environment, records}, ...benchmarks];
  storage.set(BENCHMARKS_KEY, JSON.stringify(updatedBenchmarks));
};

export const syncStorageBenchmark = (id: string) => {
  const benchmarks = getStorageBenchmarks();
  const updatedBenchmarks = benchmarks.filter(item => item.id !== id);
  storage.set(BENCHMARKS_KEY, JSON.stringify(updatedBenchmarks));
};
