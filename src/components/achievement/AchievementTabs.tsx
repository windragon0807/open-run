import { TabButtons } from './TabButtons'
import { TabEventHandlerWrapper } from './TabEventHandlerWrapper'

/**
 * 도전과제 탭 타입
 */
export type AchievementTabType = '전체' | '일반' | '반복' | '이벤트'

/**
 * 도전과제 탭 컴포넌트 Props
 */
interface AchievementTabsProps {
  /** 현재 선택된 탭 */
  activeTab: AchievementTabType
  /** 탭 변경 이벤트 핸들러 */
  onTabChange: (tab: AchievementTabType) => void
}

/**
 * 도전과제 탭 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export default function AchievementTabs({ activeTab, onTabChange }: AchievementTabsProps) {
  return (
    <div className="flex border-b relative">
      {/* 이벤트 핸들러 래퍼 컴포넌트 */}
      <TabEventHandlerWrapper onTabChange={onTabChange} />
      
      {/* 탭 버튼 컴포넌트 */}
      <TabButtons 
        activeTab={activeTab} 
        selectedTabId={activeTab}
      />
    </div>
  )
} 