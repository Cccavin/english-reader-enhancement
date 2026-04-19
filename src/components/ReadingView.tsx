import React, { useRef, useEffect, useState } from 'react';
import WordSpan from './WordSpan';
import type { ChapterAnalysis, WordMarkEvent } from '../types';

interface ReadingViewProps {
  text: string;
  analysis: ChapterAnalysis;
  onMarkWord: (event: WordMarkEvent) => void;
  onEndReading: () => void;
}

const ReadingView: React.FC<ReadingViewProps> = ({ text, analysis, onMarkWord, onEndReading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, scrolled)));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const renderText = () => {
    const parts = text.split(/(\s+|[.,!?;:"'()[\]{}])/);
    return parts.map((part, index) => {
      if (!part.trim() || !/[a-zA-Z]/.test(part)) {
        return <span key={index}>{part}</span>;
      }

      const normalized = part.toLowerCase().replace(/[^a-z]/g, '');
      const isUnknown = analysis.unknownWords.includes(normalized);

      return (
        <WordSpan
          key={index}
          word={part}
          isUnknown={isUnknown}
          onMarkWord={onMarkWord}
          context={part}
        />
      );
    });
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: '#e9ecef',
        zIndex: 100
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          transition: 'width 0.3s'
        }} />
      </div>

      <div style={{
        position: 'fixed',
        top: '4px',
        left: 0,
        right: 0,
        padding: '12px 20px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e9ecef',
        zIndex: 99
      }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          覆盖率: <strong style={{ 
            color: analysis.coverageRate >= 0.98 ? '#51cf66' : 
                   analysis.coverageRate >= 0.95 ? '#fcc419' : '#ff6b6b'
          }}>
            {(analysis.coverageRate * 100).toFixed(1)}%
          </strong>
        </div>
        <button 
          onClick={onEndReading}
          style={{
            padding: '8px 16px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          完成阅读
        </button>
      </div>

      <div 
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '60px 20px 40px',
          maxWidth: '680px',
          margin: '0 auto',
          lineHeight: '1.8',
          fontSize: '18px',
          color: '#333'
        }}
      >
        {renderText()}
      </div>

      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '8px 16px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        borderRadius: '20px',
        fontSize: '13px',
        pointerEvents: 'none',
        opacity: 0.8
      }}>
        长按单词标记生词/已掌握
      </div>
    </div>
  );
};

export default ReadingView;