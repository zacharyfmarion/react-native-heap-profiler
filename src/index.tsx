import { NativeModules } from 'react-native';

type CreateSnapshot = () => string;

export const createSnapshot: CreateSnapshot =
  NativeModules.HeapProfiler.createSnapshot;
