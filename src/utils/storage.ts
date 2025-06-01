import AsyncStorage from '@react-native-async-storage/async-storage';
import {BenchmarkRecord, ExecutionEnvironment} from '../services/benchmark';

const BENCHMARKS_KEY = '@yumlensai-benchmarks';

export type StorageBenchmark = {
  id: string;
  environment: ExecutionEnvironment;
  records: BenchmarkRecord[];
};

const generateRandomId = () => Math.random().toString(36).slice(2, 11);

export const getStorageBenchmarks = async () => {
  const benchmarksString = (await AsyncStorage.getItem(BENCHMARKS_KEY)) ?? '';
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
  await AsyncStorage.setItem(BENCHMARKS_KEY, JSON.stringify(updatedBenchmarks));
};

export const syncStorageBenchmark = async (id: string) => {
  const benchmarks = await getStorageBenchmarks();
  const updatedBenchmarks = benchmarks.filter(item => item.id !== id);
  await AsyncStorage.setItem(BENCHMARKS_KEY, JSON.stringify(updatedBenchmarks));
};
