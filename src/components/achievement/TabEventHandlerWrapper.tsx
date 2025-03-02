import { AchievementTabType } from './AchievementTabs'
import { TabEventHandler } from './TabEventHandler'

/**
 * 탭 이벤트 핸들러 래퍼 Props
 */
interface TabEventHandlerWrapperProps {
  /** 탭 변경 이벤트 핸들러 */
  onTabChange: (tab: AchievementTabType) => void
}

/**
 * 탭 이벤트 핸들러 래퍼 컴포넌트
 * 이벤트 핸들러와 서버 컴포넌트 사이의 브릿지 역할을 합니다.
 * 
 * @param props - 컴포넌트 Props
 */
export function TabEventHandlerWrapper({ onTabChange }: TabEventHandlerWrapperProps) {
  // TabEventHandler 컴포넌트를 렌더링하여 이벤트 처리
  return <TabEventHandler onTabChange={onTabChange} />;
} 