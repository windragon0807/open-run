'use client'

import { useEffect } from 'react'
import { AchievementTabType } from './AchievementModal'

/**
 * 탭 이벤트 핸들러 Props
 */
interface TabEventHandlerProps {
  onTabChange: (tab: AchievementTabType) => void
}

/**
 * 탭 이벤트 핸들러 컴포넌트
 * 커스텀 이벤트와 URL 해시를 통해 탭 변경을 처리합니다.
 * 
 * @param props - 컴포넌트 Props
 */
export function TabEventHandler({ onTabChange }: TabEventHandlerProps) {
  useEffect(() => {
    // 탭 변경 이벤트 리스너
    const handleTabChange = (e: CustomEvent) => {
      if (e.detail?.tab) {
        onTabChange(e.detail.tab);
      }
    };

    // URL 해시 변경 감지
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#tab=')) {
        const tab = hash.substring(5) as AchievementTabType;
        if (['전체', '일반', '반복', '이벤트'].includes(tab)) {
          onTabChange(tab as AchievementTabType);
        }
      }
    };

    // 초기 해시 확인
    if (window.location.hash.startsWith('#tab=')) {
      handleHashChange();
    }

    // 이벤트 리스너 등록
    window.addEventListener('achievementTabChange', handleTabChange as EventListener);
    window.addEventListener('hashchange', handleHashChange);

    // 클린업
    return () => {
      window.removeEventListener('achievementTabChange', handleTabChange as EventListener);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [onTabChange]);

  return null;
} 