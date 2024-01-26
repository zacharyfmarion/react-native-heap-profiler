import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  createHeapSnapshot,
  getHeapInfo,
  measureAllocationSize,
  type HermesHeapInfo,
} from 'react-native-heap-profiler';
import Share from 'react-native-share';

import { Platform } from 'react-native';
import { Button } from '../components/Button';

import { Trie } from 'trie-typed';
import {
  wordlistCZ,
  wordlistEN,
  wordlistES,
  wordlistIT,
  wordlistKR,
} from '../wordlists/allWordlists';
import JSONTree from 'react-native-json-tree';

// Add some memory to the heap
import './initWordlists';

export function Home() {
  const [allocatedBytes, setAllocatedBytes] = useState<number[]>([]);
  const [isMeasuringAllocations, setIsMeasuringAllocations] = useState(false);
  const [heapInfo, setHeapInfo] = useState<HermesHeapInfo | undefined>();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isMeasuringAllocations) {
        return;
      }

      const allocationSize = measureAllocationSize(() => {
        const trie = new Trie();
        for (const wordlist of [
          wordlistEN,
          wordlistES,
          wordlistCZ,
          wordlistKR,
          wordlistIT,
        ]) {
          for (const word of wordlist) {
            trie.add(word);
          }
        }
      });

      setAllocatedBytes((bytes) => [...bytes, allocationSize]);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isMeasuringAllocations]);

  const takeHeapSnapshot = useCallback(async () => {
    const path = createHeapSnapshot();
    const actualPath = `file://${path}`;

    if (Platform.OS === 'ios') {
      try {
        await Share.open({
          url: actualPath,
          title: 'Save profile',
          type: 'application/json',
        });
      } catch (error) {}
    }
  }, []);

  const getHeapInfoCallback = useCallback(() => {
    const stats = getHeapInfo(true);
    setHeapInfo(stats);
  }, []);

  const toggleIsMeasuringAllocations = useCallback(() => {
    if (!isMeasuringAllocations) {
      setAllocatedBytes([]);
    }
    setIsMeasuringAllocations((isMeasuring) => !isMeasuring);
  }, [isMeasuringAllocations]);

  const jsonData = useMemo(() => {
    return isMeasuringAllocations ? allocatedBytes : heapInfo;
  }, [isMeasuringAllocations, allocatedBytes, heapInfo]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.testList}>
        <ScrollView style={styles.scrollView}>
          <JSONTree theme={customTheme} data={jsonData as any} />
        </ScrollView>
      </View>
      <View style={styles.menu}>
        <View style={{ marginBottom: 10 }}>
          <Button
            title={
              isMeasuringAllocations
                ? 'Stop measuring allocations'
                : 'Start measuring allocations'
            }
            onPress={toggleIsMeasuringAllocations}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Button title="Take heap snapshot" onPress={takeHeapSnapshot} />
        </View>
        <Button title="Get Heap info" onPress={getHeapInfoCallback} />
      </View>
    </View>
  );
}

const customTheme = {
  width: '100%',
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  testList: {
    flex: 1,
    width: '100%',
  },
  menu: {
    width: '100%',
    flexDirection: 'column',
    padding: 25,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
});
