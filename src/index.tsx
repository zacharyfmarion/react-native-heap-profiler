import { NativeModules } from 'react-native';

type CreateSnapshot = () => string;

export const createHeapSnapshot: CreateSnapshot =
  NativeModules.HeapProfiler.createHeapSnapshot;

export * from './jsi';
export { measureAllocationSize } from './measureAllocationSize';
