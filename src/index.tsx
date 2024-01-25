import { NativeModules } from 'react-native';

type CreateSnapshot = () => string;

export const createHeapSnapshot: CreateSnapshot =
  NativeModules.HeapProfiler.createHeapSnapshot;
