import { useState, useCallback, useEffect } from 'react';
import type { UserVocabulary, WordMarkEvent } from '../types';

const STORAGE_KEY = 'english_reader_vocab';

export function useVocabulary() {
  const [vocab, setVocab] = useState<Map<string, UserVocabulary>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    }
    return new Map<string, UserVocabulary>();
  });

  // 持久化
  useEffect(() => {
    const obj = Object.fromEntries(vocab);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }, [vocab]);

  const getKnownWords = useCallback((): Set<string> => {
    const known = new Set<string>();
    vocab.forEach((entry, word) => {
      if (entry.status === 'known' || entry.familiarity >= 80) {
        known.add(word);
      }
    });
    return known;
  }, [vocab]);

  const markWord = useCallback((event: WordMarkEvent) => {
    const { word, action } = event;

    setVocab(prev => {
      const next = new Map(prev);
      const existing = next.get(word);

      if (action === 'mark_new') {
        next.set(word, {
          word,
          status: 'new',
          familiarity: existing ? Math.max(0, existing.familiarity - 20) : 0,
          reviewCount: 0,
          lastReviewed: new Date()
        });
      } else {
        next.set(word, {
          word,
          status: 'known',
          familiarity: existing ? Math.min(100, existing.familiarity + 15) : 100,
          reviewCount: (existing?.reviewCount || 0) + 1,
          lastReviewed: new Date()
        });
      }

      return next;
    });
  }, []);

  const getStats = useCallback(() => {
    let known = 0, learning = 0, newWords = 0;
    vocab.forEach(entry => {
      if (entry.status === 'known') known++;
      else if (entry.status === 'learning') learning++;
      else newWords++;
    });
    return { known, learning, newWords, total: vocab.size };
  }, [vocab]);

  const importVocab = useCallback((words: string[]) => {
    setVocab(prev => {
      const next = new Map(prev);
      words.forEach(word => {
        if (!next.has(word)) {
          next.set(word, {
            word,
            status: 'known',
            familiarity: 100,
            reviewCount: 0,
            lastReviewed: new Date()
          });
        }
      });
      return next;
    });
  }, []);

  return {
    vocab,
    getKnownWords,
    markWord,
    getStats,
    importVocab
  };
}