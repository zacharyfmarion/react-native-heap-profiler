import { getHeapInfo } from './jsi';

/**
 * Measure the allocation of a particular action in hermes
 *
 * @returns The number of bytes allocated by the action
 */
export function measureAllocationSize(f: () => any): number {
  if (!global?.gc) {
    throw new Error(
      "Garbage collector isn't available, cannot accurately measure allocation size"
    );
  }

  if (__DEV__) {
    console.warn(
      'Running measureAllocationSize with __DEV__=true, this may be less accurate'
    );
  }

  // Trigger garbage collection to avoid measuring the allocation of the previous action
  global.gc();

  const beforeHeapInfo = getHeapInfo(true);

  f();

  const afterHeapInfo = getHeapInfo(true);

  return (
    afterHeapInfo.hermes_allocatedBytes - beforeHeapInfo.hermes_allocatedBytes
  );
}
