import React from 'react';
import type { ChapterAnalysis } from '../types';

interface ReadingReportProps {
  analysis: ChapterAnalysis;
  report: {
    initialCoverage: number;
    finalCoverage: number;
    newWordsAdded: number;
    wordsMarkedKnown: number;
    comfortChanged: boolean;
    nextChapterSuggestion: string;
    unknownWordsList: string[];
  };
  duration: number;
  onContinue: () => void;
}

const ReadingReportView: React.FC<ReadingReportProps> = ({ 
  analysis, report, duration, onContinue 
}) => {
  const initialCoverage = report.initialCoverage * 100;
  const finalCoverage = report.finalCoverage * 100;
  const improvement = finalCoverage - initialCoverage;

  const getLevelColor = (coverage: number) => {
    if (coverage >= 98) return '#51cf66';
    if (coverage >= 95) return '#fcc419';
    if (coverage >= 90) return '#ff6b6b';
    return '#868e96';
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '24px',
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>📖</div>
        <h2 style={{ margin: '0', color: '#333' }}>阅读完成</h2>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          用时 {Math.floor(duration / 60)} 分 {duration % 60} 秒
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        marginBottom: '24px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '12px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>阅读前</div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: getLevelColor(initialCoverage) 
          }}>
            {initialCoverage.toFixed(1)}%
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          fontSize: '24px',
          color: improvement >= 0 ? '#51cf66' : '#ff6b6b'
        }}>
          {improvement >= 0 ? '→' : '→'}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>阅读后</div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: getLevelColor(finalCoverage) 
          }}>
            {finalCoverage.toFixed(1)}%
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '16px',
          background: '#e8f5e9',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>
            {report.wordsMarkedKnown}
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>标记为已掌握</div>
        </div>

        <div style={{
          padding: '16px',
          background: '#ffebee',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#c62828' }}>
            {report.newWordsAdded}
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>新增生词</div>
        </div>
      </div>

      <div style={{
        padding: '16px',
        background: '#e3f2fd',
        borderRadius: '10px',
        marginBottom: '20px',
        borderLeft: '4px solid #2196f3'
      }}>
        <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.6' }}>
          {report.nextChapterSuggestion}
        </div>
      </div>

      {report.unknownWordsList.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px', fontWeight: 'bold' }}>
            📝 仍需学习的单词（{report.unknownWordsList.length}个）
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {report.unknownWordsList.slice(0, 20).map(w => (
              <span key={w} style={{
                background: '#fff3e0',
                color: '#e65100',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '13px'
              }}>
                {w}
              </span>
            ))}
            {report.unknownWordsList.length > 20 && (
              <span style={{ color: '#999', fontSize: '13px', padding: '4px 0' }}>
                +{report.unknownWordsList.length - 20} 更多...
              </span>
            )}
          </div>
        </div>
      )}

      <button 
        onClick={onContinue}
        style={{
          width: '100%',
          padding: '14px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        继续下一章
      </button>
    </div>
  );
};

export default ReadingReportView;