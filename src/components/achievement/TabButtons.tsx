'use client'

import { useCallback } from 'react'
import { AchievementTabType } from './AchievementModal'

/**
 * 탭 버튼 컴포넌트 Props
 */
interface TabButtonsProps {
  /** 현재 선택된 탭 */
  activeTab: AchievementTabType
  /** 선택된 탭 ID */
  selectedTabId: string
}

/**
 * 탭 버튼 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function TabButtons({ activeTab, selectedTabId }: TabButtonsProps) {
  // 탭 변경 처리
  const handleTabChange = useCallback((tab: AchievementTabType) => {
    // URL 해시 변경
    window.location.hash = `tab=${tab}`;
    
    // 커스텀 이벤트 발생
    const event = new CustomEvent('achievementTabChange', { 
      detail: { tab } 
    });
    window.dispatchEvent(event);
  }, []);

  return (
    <div className="flex w-[328px] h-[36px] mx-auto">
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