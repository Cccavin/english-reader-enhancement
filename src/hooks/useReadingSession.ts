import { useState, useCallback, useRef } from 'react';
import type { ReadingRecord } from '../types';

export function useReadingSession(chapterId: string) {
  const [isReading, setIsReading] = useState(false);
  const [wordsLookedUp, setWordsLookedUp] = useState<string[]>([]);
  const [wordsMarked, setWordsMarked] = useState<string[]>([]);
  const startTimeRef = useRef<Date | null>(null);

  const startReading = useCallback(() => {
    setIsReading(true);
    startTimeRef.current = new Date();
    setWordsLookedUp([]);
    setWordsMarked([]);
  }, []);

  const endReading = useCallback((): ReadingRecord | null => {
    if (!startTimeRef.current) return null;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000);

    setIsReading(false);

    return {
      chapterId,
      startTime: startTimeRef.current,
      endTime,
      duration,
      wordsLookedUp: [...wordsLookedUp],
      wordsMarked: [...wordsMarked],
      finalCoverage: 0 // 由上层计算
    };
  }, [chapterId, wordsLookedUp, wordsMarked]);

  const lookupWord = useCallback((word: string) => {
    setWordsLookedUp(prev => {
      if (prev.includes(word)) return prev;
      return [...prev, word];
    });
  }, []);

  const markWord = useCallback((word: string, isNew: boolean) => {
    if (isNew) {
      setWordsMarked(prev => {
        if (prev.includes(word)) return prev;
        return [...prev, word];
      });
    } else {
      setWordsMarked(prev => prev.filter(w => w !== word));
    }
  }, []);

  return {
    isReading,
    wordsLookedUp,
    wordsMarked,
    startReading,
    endReading,
    lookupWord,
    markWord
  };
}