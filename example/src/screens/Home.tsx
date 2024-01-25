import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createHeapSnapshot } from 'react-native-heap-profiler';
import { Text } from '../components/Text';
import Share from 'react-native-share';
import { Trie } from 'trie-typed';
import {
  wordlistCZ,
  wordlistEN,
  wordlistES,
  wordlistFR,
  wordlistIT,
  wordlistJP,
  wordlistKR,
  wordlistPT,
  wordlistZHCN,
  wordlistZHTW,
} from '../wordlists/allWordlists';
import { Platform } from 'react-native';

export type LocalType =
  | 'allLangs'
  | 'en'
  | 'es'
  | 'fr'
  | 'it'
  | 'pt'
  | 'cz'
  | 'jp'
  | 'kr'
  | 'zhCN'
  | 'zhTW';

// Use some memory
const bip39Dictionaries: Record<LocalType, Trie> = {
  allLangs: new Trie(),
  en: new Trie(),
  es: new Trie(),
  fr: new Trie(),
  it: new Trie(),
  pt: new Trie(),
  cz: new Trie(),
  jp: new Trie(),
  kr: new Trie(),
  zhCN: new Trie(),
  zhTW: new Trie(),
};

const wordlists: [LocalType, string[]][] = [
  ['en', wordlistEN],
  ['es', wordlistES],
  ['fr', wordlistFR],
  ['it', wordlistIT],
  ['pt', wordlistPT],
  ['cz', wordlistCZ],
  ['jp', wordlistJP],
  ['kr', wordlistKR],
  ['zhCN', wordlistZHCN],
  ['zhTW', wordlistZHTW],
];

wordlists.forEach(([locale, wordList]) => {
  for (const word of wordList) {
    bip39Dictionaries[locale].add(word);
    bip39Dictionaries.allLangs.add(word);
  }
});

export function Home() {
  useEffect(() => {
    setTimeout(async () => {
      const path = createHeapSnapshot();
      const actualPath = `file://${path}`;

      // On android you can just run:
      // npx react-native-heap-profiler --appId=com.fasttrieexample --outputDir=<my-path>
      if (Platform.OS === 'ios') {
        try {
          await Share.open({
            url: actualPath,
            title: 'Save profile',
            type: 'application/json',
          });
        } catch (error) {
          // An error is thrown when the user doesn't share, but we catch
          // this since that is fine
        }
      }
    }, 1000);
  });

  return (
    <View style={styles.mainContainer}>
      <Text>Heap Profiler!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  testList: {
    flex: 9,
  },
  menu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'space-around',
    justifyContent: 'space-around',
  },
  scrollView: {
    paddingHorizontal: 10,
  },
});
