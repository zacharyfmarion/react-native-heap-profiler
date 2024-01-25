# react-native-heap-profiler

A fast way to take a Hermes heap profile from javascript in React Native.

## Why

Sometimes it is useful to be able to imperatively take a heap profile from javascript. This is especially useful when you want to take a heap profile at a specific point in time, for example when a user performs a specific action.

## Installation

```sh
npm install react-native-heap-profiler
yarn add react-native-heap-profiler
```

## Usage

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

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
