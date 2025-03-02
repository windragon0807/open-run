import { TabButtons } from './TabButtons'
import { TabEventHandler } from './TabEventHandler'
import { AchievementTabType } from './AchievementModal'

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
    <div className="flex justify-center w-full relative">
      {/* 이벤트 핸들러 */}
      <TabEventHandler onTabChange={onTabChange} />
      
      {/* 탭 버튼 */}
      <TabButtons 
        activeTab={activeTab} 
        selectedTabId={activeTab}
      />
    </div>
  )
} 