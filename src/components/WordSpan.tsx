import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { WordMarkEvent } from '../types';

interface WordSpanProps {
  word: string;
  isUnknown: boolean;
  onMarkWord: (event: WordMarkEvent) => void;
  context?: string;
}

const WordSpan: React.FC<WordSpanProps> = ({ word, isUnknown, onMarkWord, context }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  // 处理长按
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    setIsPressed(true);
    longPressTimer.current = setTimeout(() => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      setMenuPos({ 
        x: Math.min(clientX, window.innerWidth - 220), 
        y: clientY + 20 
      });
      setShowMenu(true);
      setIsPressed(false);
    }, 600); // 600ms 长按触发
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsPressed(false);
  }, []);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (spanRef.current && !spanRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showMenu]);

  const handleMark = (action: 'mark_new' | 'mark_known') => {
    onMarkWord({
      word,
      action,
      timestamp: new Date(),
      context
    });
    setShowMenu(false);
  };

  return (
    <>
      <span
        ref={spanRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        style={{
          borderBottom: isUnknown ? '2px dotted #ff6b6b' : 'none',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          padding: '2px 1px',
          borderRadius: '3px',
          backgroundColor: isPressed ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
          transition: 'background-color 0.2s',
          position: 'relative'
        }}
      >
        {word}
      </span>

      {showMenu && (
        <div 
          style={{
            position: 'fixed',
            left: menuPos.x,
            top: menuPos.y,
            background: '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            padding: '16px',
            zIndex: 1000,
            minWidth: '200px',
            animation: 'popupIn 0.2s ease-out'
          }}
        >
          <style>{`
            @keyframes popupIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '16px' }}>
            {isUnknown ? '🆕 生词' : '✅ 已掌握'}
          </div>
          <div style={{ fontSize: '20px', color: '#333', marginBottom: '12px', fontWeight: 'bold' }}>
            {word}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {isUnknown ? (
              <button 
                onClick={() => handleMark('mark_known')}
                style={{
                  padding: '10px',
                  background: '#51cf66',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                ✓ 标记为已掌握
              </button>
            ) : (
              <button 
                onClick={() => handleMark('mark_new')}
                style={{
                  padding: '10px',
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                ✕ 标记为生词
              </button>
            )}

            <button 
              onClick={() => setShowMenu(false)}
              style={{
                padding: '8px',
                border: '1px solid #e9ecef',
                background: '#f8f9fa',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#666'
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WordSpan;