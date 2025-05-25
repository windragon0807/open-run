import { AchievementTabType } from './AchievementModal'
import AllAchievementsClient from './content/AllAchievementsClient'
import EventAchievementsClient from './content/EventAchievementsClient'
import RegularAchievementsClient from './content/RegularAchievementsClient'
import RepeatAchievementsClient from './content/RepeatAchievementsClient'

/**
 * 도전과제 콘텐츠 컴포넌트 Props
 */
interface AchievementContentProps {
  /** 선택된 탭 */
  activeTab: AchievementTabType
}

/**
 * 도전과제 콘텐츠 컴포넌트
 *
 * @param props - 컴포넌트 Props
 */
export default function AchievementContent({ activeTab }: AchievementContentProps) {
  return (
    <div className='h-full overflow-y-auto rounded-t-[10px] bg-[#FFFFFF]'>
      {activeTab === '전체' && <AllAchievementsClient />}
      {activeTab === '일반' && <RegularAchievementsClient />}
      {activeTab === '반복' && <RepeatAchievementsClient />}
      {activeTab === '이벤트' && <EventAchievementsClient />}
    </div>
  )
}
