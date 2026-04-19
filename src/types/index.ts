// 用户词库状态
export interface UserVocabulary {
  word: string;
  status: 'known' | 'learning' | 'new';
  familiarity: number;
  reviewCount: number;
  lastReviewed: Date;
}

// 章节分析结果
export interface ChapterAnalysis {
  chapterId: string;
  totalWords: number;
  uniqueWords: number;
  unknownWords: string[];
  knownWords: string[];
  coverageRate: number;
  comfortLevel: ComfortLevel;
  estimatedLevel: CEFRLevel;
  highFreqUnknown: string[];
  wordFrequency: Map<string, number>;
}

export type ComfortLevel = 'comfortable' | 'challenging' | 'frustrating' | 'unsuitable';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// 阅读记录
export interface ReadingRecord {
  chapterId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  wordsLookedUp: string[];
  wordsMarked: string[];
  finalCoverage: number;
}

// 阅读报告
export interface ReadingReport {
  chapterId: string;
  durationMinutes: number;
  wordsRead: number;
  initialCoverage: number;
  finalCoverage: number;
  newWordsAdded: number;
  wordsMarkedKnown: number;
  comfortChanged: boolean;
  nextChapterSuggestion: string;
  unknownWordsList: string[];
}

// 单词标记事件
export interface WordMarkEvent {
  word: string;
  action: 'mark_new' | 'mark_known';
  timestamp: Date;
  context?: string;
}