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
