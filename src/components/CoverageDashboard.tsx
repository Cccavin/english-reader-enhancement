import React from 'react';
import type { ChapterAnalysis } from '../types';

interface CoverageDashboardProps {
  analysis: ChapterAnalysis;
  onStartReading: () => void;
}

const CoverageDashboard: React.FC<CoverageDashboardProps> = ({ analysis, onStartReading }) => {
  const getComfortColor = (level: string) => {
    switch(level) {
      case 'comfortable': return '#51cf66';
      case 'challenging': return '#fcc419';
      case 'frustrating': return '#ff6b6b';
      default: return '#868e96';
    }
  };

  const getComfortText = (level: string) => {
    switch(level) {
      case 'comfortable': return '舒适区（≥98%）- 可流畅阅读';
      case 'challenging': return '挑战区（95%-98%）- 偶尔查词';
      case 'frustrating': return '困难区（90%-95%）- 频繁卡顿';
      default: return '不适合（<90%）- 建议换书';
    }
  };

  const getComfortEmoji = (level: string) => {
    switch(level) {
      case 'comfortable': return '😊';
      case 'challenging': return '🤔';
      case 'frustrating': return '😰';
      default: return '⚠️';
    }
  };

  const coverage = analysis.coverageRate * 100;
  const circumference = 2 * Math.PI * 15.9155;
  const strokeDashoffset = circumference - (coverage / 100) * circumference;

  return (
    <div style={{
      padding: '24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      color: 'white',
      maxWidth: '500px',
      margin: '0 auto',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        📊 章节词汇分析
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
        {/* 覆盖率环形图 */}
        <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
          <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            <path 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              fill="none" 
              stroke="rgba(255,255,255,0.2)" 
              strokeWidth="3" 
            />
            <path 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              fill="none" 
              stroke={getComfortColor(analysis.comfortLevel)} 
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                transition: 'stroke-dashoffset 1s ease-out'
              }}
            />
          </svg>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            fontWeight: 'bold',
            fontSize: '20px'
          }}>
            {coverage.toFixed(1)}%
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ 
            color: getComfortColor(analysis.comfortLevel), 
            fontWeight: 'bold', 
            fontSize: '16px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {getComfortEmoji(analysis.comfortLevel)} {getComfortText(analysis.comfortLevel)}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6' }}>
            总词数：<strong>{analysis.totalWords}</strong> | 去重词：<strong>{analysis.uniqueWords}</strong><br/>
            生词数：<strong style={{ color: '#ff6b6b' }}>{analysis.unknownWords.length}</strong> 个
          </div>
        </div>
      </div>

      {/* 高频生词预览 */}
      {analysis.highFreqUnknown.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
            🔥 本章高频生词（建议优先学习）：
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {analysis.highFreqUnknown.map(w => (
              <span key={w} style={{ 
                background: 'rgba(255,255,255,0.15)', 
                color: '#fff', 
                padding: '4px 12px', 
                borderRadius: '12px', 
                fontSize: '13px',
                backdropFilter: 'blur(10px)'
              }}>
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={onStartReading}
        style={{
          width: '100%',
          padding: '14px',
          background: analysis.comfortLevel === 'unsuitable' ? '#868e96' : '#fff',
          color: analysis.comfortLevel === 'unsuitable' ? '#fff' : '#667eea',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: analysis.comfortLevel === 'unsuitable' ? 'not-allowed' : 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        disabled={analysis.comfortLevel === 'unsuitable'}
      >
        {analysis.comfortLevel === 'unsuitable' ? '词汇难度过高，建议换书' : '开始阅读'}
      </button>
    </div>
  );
};

export default CoverageDashboard;