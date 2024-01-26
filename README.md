# react-native-heap-profiler

A fast way to take a Hermes heap profile from javascript in React Native. Inspired by [react-native-release-profiler](https://github.com/margelo/react-native-release-profiler).

## Why

* Sometimes it is useful to be able to imperatively take a heap profile from javascript, for example when a user performs a specific action. 
* Streaming the profile using chrome devtools is much less reliable and leads to a lot of app crashes and hangs (which may be improved in the future). 
* Hermes also exposes some other helpful information (e.g. heap data) that is not available in the chrome devtools.

## Installation

```sh
npm install react-native-heap-profiler
yarn add react-native-heap-profiler
```

## High Level API

```ts
import { 
  getHeapInfo, 
  createHeapSnapshot, 
  measureAllocationSize 
} from 'react-native-heap-profiler';

// Run `npx react-native-heap-profiler --appId=com.your.app.id --outputDir=/path/to/output`
// to get the heap snapshot from your android device (dev only)
const path = createHeapSnapshot();

// Get realtime heap information from hermes (production safe)
const heapInfo = getHeapInfo(path);
console.log(heapInfo.hermes_allocatedBytes);

// Logs the number of bytes allocated by the function (production safe)
const allocationSize = measureAllocationSize(() => {
  new Array(1000000);
});
```

## Taking a Profile

1. Install react-native-heap-profiler
2. Start your app in development mode
3. Take a heap profile

```ts
import { createHeapSnapshot } from 'react-native-heap-profiler';

createHeapSnapshot();
```

4. Pull the snapshot from your device

Android:

First find your app id. It should look something like com.mypackage and be visible in app/build.gradle in the defaultConfig section:

```groovy
android {
    defaultConfig {
        applicationId "com.profilern" // <-- This one!
        // ...
    }
}
```

Then you can run this command:

```sh
npx react-native-heap-profiler --appId=com.your.app.id --outputDir=/path/to/output
```

iOS:

On iOS you can use `react-native-share` to share the file to your computer:

```ts
if (Platform.OS === 'ios') {
  const path = createHeapSnapshot();
  const actualPath = `file://${path}`;

  try {
    await Share.open({
      url: actualPath,
      title: 'Save heapsnapshot',
      type: 'application/json',
    });
  } catch (error) {
    // An error is thrown when the user doesn't share, but we catch
    // this since that is fine
  }
}
```

## API Reference

### `HermesHeapInfo` Type

Fields returned from hermes when getting heap information. `hermes_allocatedBytes` represents the current number of allocated bytes in the heap.

```ts
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
```

### Functions 

`createHeapSnapshot(): string` (Dev only!)

> Takes a heap snapshot and returns the path to the snapshot file. See the usage section above for details

```javascript
const pathToFile = createHeapSnapshot();
```

`getHeapInfo(includeExpensive: boolean): HermesHeapInfo`

> Request statistics about the current state of the runtime's heap. This function can be called at any time, and should produce information that is correct at the instant it is called (i.e, not stale). Runs in production!

```ts
const heapInfo = getHeapInfo(true);
console.log(heapInfo.hermes_allocatedBytes); // 123456
```

`measureAllocationSize(f: () => any): number`

> Compares the number of bytes allocated before and after a function call and returns the difference. This is useful for measuring the size of objects. Note that this function runs garbage collection before the function, so the results should be quite stable. Still, it is best to average a series of many measurements and exclude outliers. Works in production and development.

```javascript
const allocationSize = measureAllocationSize(() => {
  const trie = new Trie();
  for (const word of ['a', 'ab', 'abc', 'abcd', 'abcde', 'abcdef' /* ... */]) {
    trie.add(word);
  }
});

console.log(allocationSize); // 1152640
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
