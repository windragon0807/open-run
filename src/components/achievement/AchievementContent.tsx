import { 
  RegularAchievementType, 
  RepeatAchievementType, 
  EventAchievementType 
} from '@/types/achievement'
import { AchievementTabType } from './AchievementTabs'
import { AllAchievementsClient } from './content/AllAchievementsClient'
import { RegularAchievementsClient } from './content/RegularAchievementsClient'
import { RepeatAchievementsClient } from './content/RepeatAchievementsClient'
import { EventAchievementsClient } from './content/EventAchievementsClient'

/**
 * 도전과제 콘텐츠 컴포넌트 Props
 */
interface AchievementContentProps {
  /** 선택된 탭 */
  activeTab: AchievementTabType
  /** 일반 도전과제 목록 */
  regularAchievements: RegularAchievementType[]
  /** 반복 도전과제 목록 */
  repeatAchievements: RepeatAchievementType[]
  /** 이벤트 도전과제 목록 */
  eventAchievements: EventAchievementType[]
}

/**
 * 도전과제 콘텐츠 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export default function AchievementContent({ 
  activeTab, 
  regularAchievements, 
  repeatAchievements, 
  eventAchievements 
}: AchievementContentProps) {
  return (
    <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
      {activeTab === '전체' && (
        <AllAchievementsClient 
          regularAchievements={regularAchievements} 
          repeatAchievements={repeatAchievements} 
          eventAchievements={eventAchievements} 
        />
      )}
      {activeTab === '일반' && <RegularAchievementsClient achievements={regularAchievements} />}
      {activeTab === '반복' && <RepeatAchievementsClient achievements={repeatAchievements} />}
      {activeTab === '이벤트' && <EventAchievementsClient achievements={eventAchievements} />}
    </div>
  )
} 