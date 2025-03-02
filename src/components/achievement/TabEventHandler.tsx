import { useEffect } from 'react'
import { AchievementTabType } from './AchievementTabs'

/**
 * 탭 이벤트 핸들러 Props
 */
interface TabEventHandlerProps {
  onTabChange: (tab: AchievementTabType) => void
}

/**
 * 탭 이벤트 핸들러 컴포넌트
 * 커스텀 이벤트를 리스닝하여 탭 변경 이벤트를 처리합니다.
 * 
 * @param props - 컴포넌트 Props
 */
export function TabEventHandler({ onTabChange }: TabEventHandlerProps) {
  useEffect(() => {
    // 탭 변경 이벤트 리스너 등록
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.tab) {
        onTabChange(customEvent.detail.tab);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('achievementTabChange', handleTabChange);

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

    // 페이지 로드 시 초기 해시 확인
    if (window.location.hash.startsWith('#tab=')) {
      handleHashChange();
    }

    // 해시 변경 이벤트 리스너 등록
    window.addEventListener('hashchange', handleHashChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('achievementTabChange', handleTabChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [onTabChange]);

  // 이 컴포넌트는 UI를 렌더링하지 않고 이벤트 처리만 담당
  return null;
} 