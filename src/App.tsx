import React, { useState, useCallback, useMemo } from 'react';
import { VocabularyAnalyzer } from './utils/analyzer';
import { useVocabulary } from './hooks/useVocabulary';
import { useReadingSession } from './hooks/useReadingSession';
import CoverageDashboard from './components/CoverageDashboard';
import ReadingView from './components/ReadingView';
import ReadingReportView from './components/ReadingReport';
import { demoChapter, sampleUserVocab } from './data/demoChapter';
import type { ChapterAnalysis, WordMarkEvent } from './types';

type AppState = 'dashboard' | 'reading' | 'report';

function App() {
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [analysis, setAnalysis] = useState<ChapterAnalysis | null>(null);
  const [readingReport, setReadingReport] = useState<any>(null);
  const [readingDuration, setReadingDuration] = useState(0);

  const { vocab, getKnownWords, markWord, getStats } = useVocabulary();
  const session = useReadingSession(demoChapter.id);

  // 初始化：导入示例词库
  useState(() => {
    // 实际项目中这里会加载用户的真实词库
    return null;
  });

  const analyzer = useMemo(() => {
    const known = getKnownWords();
    // 合并示例词库（实际项目中移除这行）
    sampleUserVocab.forEach(w => known.add(w));
    return new VocabularyAnalyzer(known);
  }, [vocab]);

  const handleAnalyze = useCallback(() => {
    const result = analyzer.analyzeChapter(demoChapter.content, demoChapter.id);
    setAnalysis(result);
  }, [analyzer]);

  const handleStartReading = useCallback(() => {
    setAppState('reading');
    session.startReading();
  }, [session]);

  const handleMarkWord = useCallback((event: WordMarkEvent) => {
    markWord(event);
    session.lookupWord(event.word);
    if (event.action === 'mark_new') {
      session.markWord(event.word, true);
    } else {
      session.markWord(event.word, false);
    }
  }, [markWord, session]);

  const handleEndReading = useCallback(() => {
    const record = session.endReading();
    if (record && analysis) {
      const report = analyzer.generateReport(analysis, {
        wordsMarked: session.wordsMarked,
        wordsLookedUp: session.wordsLookedUp,
        duration: record.duration
      });
      setReadingReport(report);
      setReadingDuration(record.duration);
      setAppState('report');
    }
  }, [session, analysis, analyzer]);

  const handleContinue = useCallback(() => {
    setAppState('dashboard');
    setAnalysis(null);
    setReadingReport(null);
  }, []);

  // 词库统计
  const stats = getStats();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 顶部导航 */}
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #e9ecef',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#667eea' }}>
          📚 English Reader
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          词库: {stats.known}已掌握 | {stats.learning}学习中 | {stats.newWords}生词
        </div>
      </nav>

      <div style={{ padding: '20px' }}>
        {appState === 'dashboard' && (
          <div>
            {!analysis ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>📖</div>
                <h1 style={{ color: '#333', marginBottom: '12px' }}>
                  英语阅读增强器
                </h1>
                <p style={{ color: '#666', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px', lineHeight: '1.6' }}>
                  基于 <strong>Hu & Nation 98%覆盖率理论</strong>，<br/>
                  智能分析章节难度，长按标记生词，<br/>
                  让每一章阅读都舒适高效。
                </p>
                <button 
                  onClick={handleAnalyze}
                  style={{
                    padding: '14px 32px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  分析《{demoChapter.title}》
                </button>
              </div>
            ) : (
              <CoverageDashboard 
                analysis={analysis} 
                onStartReading={handleStartReading} 
              />
            )}
          </div>
        )}

        {appState === 'reading' && analysis && (
          <ReadingView
            text={demoChapter.content}
            analysis={analysis}
            onMarkWord={handleMarkWord}
            onEndReading={handleEndReading}
          />
        )}

        {appState === 'report' && analysis && readingReport && (
          <ReadingReportView
            analysis={analysis}
            report={readingReport}
            duration={readingDuration}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}

export default App;