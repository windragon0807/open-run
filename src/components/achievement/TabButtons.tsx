'use client'

import { useCallback } from 'react'
import { AchievementTabType } from './AchievementTabs'

/**
 * 탭 버튼 컴포넌트 Props
 */
interface TabButtonsProps {
  /** 현재 선택된 탭 */
  activeTab: AchievementTabType
  /** 선택된 탭 ID (직렬화 가능한 값) */
  selectedTabId: string
}

/**
 * 탭 버튼 컴포넌트
 * 클라이언트에서 탭 클릭 이벤트를 처리하고 URL 해시를 사용해 상태를 전달합니다.
 * 
 * @param props - 컴포넌트 Props
 */
export function TabButtons({ activeTab, selectedTabId }: TabButtonsProps) {
  // 직렬화 가능한 URL을 통해 상태 전달
  const handleTabChange = useCallback((tab: AchievementTabType) => {
    // URL 해시 변경을 통해 탭 변경 알림
    window.location.hash = `tab=${tab}`;
    
    // 커스텀 이벤트 발생 (대안적 방법)
    const event = new CustomEvent('achievementTabChange', { 
      detail: { tab } 
    });
    window.dispatchEvent(event);
  }, []);

  return (
    <div className="flex h-[36px] w-[328px] mx-auto">
      <button 
        className={`w-[82px] h-[36px] text-center ${
          activeTab === '전체' 
          ? 'bg-[#222222] text-[#F8F9FA] rounded-tl-[10px] rounded-tr-[10px]' 
          : 'bg-[#F8F9FA] text-[#89939D]'
        }`}
        onClick={() => handleTabChange('전체')}
        data-tab-id="전체"
      >
        전체
      </button>
      <button 
        className={`w-[82px] h-[36px] text-center ${
          activeTab === '일반' 
          ? 'bg-[#222222] text-[#F8F9FA] rounded-tl-[10px] rounded-tr-[10px]' 
          : 'bg-[#F8F9FA] text-[#89939D]'
        }`}
        onClick={() => handleTabChange('일반')}
        data-tab-id="일반"
      >
        일반
      </button>
      <button 
        className={`w-[82px] h-[36px] text-center ${
          activeTab === '반복' 
          ? 'bg-[#222222] text-[#F8F9FA] rounded-tl-[10px] rounded-tr-[10px]' 
          : 'bg-[#F8F9FA] text-[#89939D]'
        }`}
        onClick={() => handleTabChange('반복')}
        data-tab-id="반복"
      >
        반복
      </button>
      <button 
        className={`w-[82px] h-[36px] text-center ${
          activeTab === '이벤트' 
          ? 'bg-[#222222] text-[#F8F9FA] rounded-tl-[10px] rounded-tr-[10px]' 
          : 'bg-[#F8F9FA] text-[#89939D]'
        }`}
        onClick={() => handleTabChange('이벤트')}
        data-tab-id="이벤트"
      >
        이벤트
      </button>
    </div>
  )
} 