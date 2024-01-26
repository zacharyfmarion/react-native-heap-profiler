import { Platform, NativeModules } from 'react-native';

export interface HermesHeapInfo {
  hermes_allocatedBytes: number;
  hermes_externalBytes: number;
  hermes_full_gcCPUTime: number;
  hermes_full_gcCPUTimeSquares: number;
  hermes_full_gcMaxCPUPause: number;
  hermes_full_gcTime: number;
  hermes_full_gcTimeSquares: number;
  hermes_full_maxPause: number;
  hermes_full_numCollections: number;
  hermes_heapSize: number;
  hermes_mallocSizeEstimate: number;
  hermes_numCollections: number;
  hermes_numMarkStackOverflows: number;
  hermes_peakAllocatedBytes: number;
  hermes_peakLiveAfterGC: number;
  hermes_totalAllocatedBytes: number;
  hermes_va: number;
  hermes_yg_gcCPUTime: number;
  hermes_yg_gcCPUTimeSquares: number;
  hermes_yg_gcMaxCPUPause: number;
  hermes_yg_gcTime: number;
  hermes_yg_gcTimeSquares: number;
  hermes_yg_maxPause: number;
  hermes_yg_numCollections: number;
}

type HeapProfilerModule = {
  getHeapInfo: (includeExpensive: boolean) => HermesHeapInfo;
};

declare global {
  var __HeapProfiler: HeapProfilerModule;
}

const LINKING_ERROR =
  `The package 'react-native-heap-profile' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const NativeHeapProfiler = NativeModules.HeapProfiler
  ? NativeModules.HeapProfiler
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

if (global.__HeapProfiler == null) {
  const installed = NativeHeapProfiler.install();

  if (installed) {
  } else {
    throw new Error(LINKING_ERROR);
  }
}

export const getHeapInfo = global.__HeapProfiler.getHeapInfo;
