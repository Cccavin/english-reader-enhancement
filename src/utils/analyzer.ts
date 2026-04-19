import type { ChapterAnalysis, ComfortLevel, CEFRLevel } from '../types';

export class VocabularyAnalyzer {
  private userVocab: Set<string>;
  private cefrWords: Map<string, CEFRLevel>;

  constructor(userVocabulary: Set<string>) {
    this.userVocab = userVocabulary;
    this.cefrWords = this.loadCEFRWords();
  }

  analyzeChapter(text: string, chapterId: string): ChapterAnalysis {
    const words = this.tokenize(text);
    const total = words.length;
    const frequency = this.calculateFrequency(words);
    const unique = Array.from(new Set(words));

    const knownWords: string[] = [];
    const unknownWords: string[] = [];

    unique.forEach(word => {
      if (this.userVocab.has(word)) {
        knownWords.push(word);
      } else {
        unknownWords.push(word);
      }
    });

    const unknownCount = words.filter(w => !this.userVocab.has(w)).length;
    const coverage = total > 0 ? (total - unknownCount) / total : 0;

    // 高频生词（出现次数>1且不在用户词库中）
    const highFreqUnknown = Array.from(frequency.entries())
      .filter(([word, count]) => !this.userVocab.has(word) && count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word]) => word);

    return {
      chapterId,
      totalWords: total,
      uniqueWords: unique.length,
      unknownWords,
      knownWords,
      coverageRate: coverage,
      comfortLevel: this.getComfortLevel(coverage),
      estimatedLevel: this.estimateLevel(unknownWords),
      highFreqUnknown,
      wordFrequency: frequency
    };
  }

  private tokenize(text: string): string[] {
    const cleaned = text
      .toLowerCase()
      .replace(/[^a-zA-Z\s'-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = cleaned.split(/\s+/).filter(w => w.length > 1);
    return words.map(w => this.lemmatize(w));
  }

  private lemmatize(word: string): string {
    const rules = [
      { pattern: /ies$/, replacement: 'y' },
      { pattern: /ied$/, replacement: 'y' },
      { pattern: /(ss|us|is|os)$/, replacement: null },
      { pattern: /s$/, replacement: '' },
      { pattern: /ing$/, replacement: '' },
      { pattern: /(ed|er|est)$/, replacement: '' },
      { pattern: /(tion|sion|ness|ment|ity|ty)$/, replacement: '' }
    ];

    for (const rule of rules) {
      if (rule.replacement === null) continue;
      if (word.match(rule.pattern)) {
        const candidate = word.replace(rule.pattern, rule.replacement || '');
        if (candidate.length > 1) return candidate;
      }
    }
    return word;
  }

  private calculateFrequency(words: string[]): Map<string, number> {
    const freq = new Map<string, number>();
    words.forEach(word => {
      freq.set(word, (freq.get(word) || 0) + 1);
    });
    return freq;
  }

  private getComfortLevel(coverage: number): ComfortLevel {
    if (coverage >= 0.98) return 'comfortable';
    if (coverage >= 0.95) return 'challenging';
    if (coverage >= 0.90) return 'frustrating';
    return 'unsuitable';
  }

  private estimateLevel(unknownWords: string[]): CEFRLevel {
    if (unknownWords.length === 0) return 'C2';
    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    let totalLevel = 0;
    let count = 0;

    unknownWords.forEach(word => {
      const level = this.cefrWords.get(word);
      if (level) {
        totalLevel += levels.indexOf(level);
        count++;
      }
    });

    if (count === 0) return 'B1';
    const avgIndex = Math.round(totalLevel / count);
    return levels[Math.min(avgIndex, 5)];
  }

  private loadCEFRWords(): Map<string, CEFRLevel> {
    const words: Record<string, CEFRLevel> = {
      'the': 'A1', 'be': 'A1', 'to': 'A1', 'of': 'A1', 'and': 'A1',
      'a': 'A1', 'in': 'A1', 'that': 'A1', 'have': 'A1', 'i': 'A1',
      'it': 'A1', 'for': 'A1', 'not': 'A1', 'on': 'A1', 'with': 'A1',
      'he': 'A1', 'as': 'A1', 'you': 'A1', 'do': 'A1', 'at': 'A1',
      'this': 'A1', 'but': 'A1', 'his': 'A1', 'by': 'A1', 'from': 'A1',
      'they': 'A1', 'we': 'A1', 'say': 'A1', 'her': 'A1', 'she': 'A1',
      'or': 'A1', 'an': 'A1', 'will': 'A1', 'my': 'A1', 'one': 'A1',
      'all': 'A1', 'would': 'A1', 'there': 'A1', 'their': 'A1', 'what': 'A1',
      'so': 'A1', 'up': 'A1', 'out': 'A1', 'if': 'A1', 'about': 'A1',
      'who': 'A1', 'get': 'A1', 'which': 'A1', 'go': 'A1', 'me': 'A1',
      'when': 'A1', 'make': 'A1', 'can': 'A1', 'like': 'A1', 'time': 'A1',
      'no': 'A1', 'just': 'A1', 'him': 'A1', 'know': 'A1', 'take': 'A1',
      'people': 'A1', 'into': 'A1', 'year': 'A1', 'your': 'A1', 'good': 'A1',
      'some': 'A1', 'could': 'A1', 'them': 'A1', 'see': 'A1', 'other': 'A1',
      'than': 'A1', 'then': 'A1', 'now': 'A1', 'look': 'A1', 'only': 'A1',
      'come': 'A1', 'its': 'A1', 'over': 'A1', 'think': 'A1', 'also': 'A1',
      'back': 'A1', 'after': 'A1', 'use': 'A1', 'two': 'A1', 'how': 'A1',
      'our': 'A1', 'work': 'A1', 'first': 'A1', 'well': 'A1', 'way': 'A1',
      'even': 'A1', 'new': 'A1', 'want': 'A1', 'because': 'A1', 'any': 'A1',
      'these': 'A1', 'give': 'A1', 'day': 'A1', 'most': 'A1', 'us': 'A1',
      'is': 'A1', 'was': 'A1', 'are': 'A1', 'were': 'A1', 'been': 'A1',
      'has': 'A1', 'had': 'A1', 'did': 'A1', 'does': 'A1', 'doing': 'A1',
      'done': 'A1', 'being': 'A1', 'am': 'A1',
      'although': 'B1', 'environment': 'B1', 'government': 'B1', 'experience': 'B1',
      'education': 'B1', 'relationship': 'B1', 'development': 'B1', 'technology': 'B1',
      'opportunity': 'B1', 'community': 'B1', 'situation': 'B1', 'difference': 'B1',
      'understand': 'B1', 'important': 'B1', 'different': 'B1', 'necessary': 'B1',
      'significant': 'B2', 'available': 'B2', 'consider': 'B2', 'determine': 'B2',
      'establish': 'B2', 'individual': 'B2', 'particular': 'B2', 'require': 'B2',
      'approach': 'B2', 'benefit': 'B2', 'challenge': 'B2', 'consequence': 'B2',
      'comprehensive': 'C1', 'substantial': 'C1', 'fundamental': 'C1', 'inevitable': 'C1',
      'controversial': 'C1', 'hypothesis': 'C1', 'perspective': 'C1', 'sophisticated': 'C1'
    };

    return new Map(Object.entries(words));
  }

  generateReport(
    initialAnalysis: ChapterAnalysis,
    record: { wordsMarked: string[]; wordsLookedUp: string[]; duration: number }
  ) {
    const markedNew = new Set(record.wordsMarked);
    const markedKnown = new Set(
      record.wordsLookedUp.filter(w => !record.wordsMarked.includes(w))
    );

    const effectiveKnown = new Set([...this.userVocab, ...markedKnown]);
    const remainingUnknown = initialAnalysis.unknownWords.filter(
      w => !effectiveKnown.has(w) && !markedNew.has(w)
    );

    const finalCoverage = initialAnalysis.totalWords > 0
      ? (initialAnalysis.totalWords - remainingUnknown.length) / initialAnalysis.totalWords
      : 0;

    const initialComfort = this.getComfortLevel(initialAnalysis.coverageRate);
    const finalComfort = this.getComfortLevel(finalCoverage);

    const suggestion = finalCoverage >= 0.98
      ? "🎉 恭喜！本章已达标（≥98%）。建议继续下一章，保持舒适阅读节奏。"
      : finalCoverage >= 0.95
      ? "⚠️ 接近舒适区。建议复习本章标记的 " + markedNew.size + " 个生词后再继续。"
      : "📚 建议先巩固本章高频生词，或选择词汇覆盖率更高的材料。";

    return {
      initialCoverage: initialAnalysis.coverageRate,
      finalCoverage,
      newWordsAdded: markedNew.size,
      wordsMarkedKnown: markedKnown.size,
      comfortChanged: initialComfort !== finalComfort,
      nextChapterSuggestion: suggestion,
      unknownWordsList: remainingUnknown
    };
  }
}