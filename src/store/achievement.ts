import { create } from 'zustand'
import { EventAchievementType, RegularAchievementType, RepeatAchievementType } from '@type/achievement'

/**
 * 도전과제 스토어 상태 인터페이스
 */
interface AchievementState {
  /** 일반 도전과제 목록 */
  regularAchievements: RegularAchievementType[]
  /** 반복 도전과제 목록 */
  repeatAchievements: RepeatAchievementType[]
  /** 이벤트 도전과제 목록 */
  eventAchievements: EventAchievementType[]
  /** 도전과제 로딩 상태 */
  isLoading: boolean
  /** 도전과제 로딩 에러 */
  error: string | null
  /** 도전과제 로드 함수 */
  fetchAchievements: () => Promise<void>
  /** 도전과제 상태 업데이트 함수 */
  updateAchievementStatus: (id: string, status: '진행중' | '완료' | '대기중') => void
}

/**
 * 도전과제 스토어
 */
export const useAchievementStore = create<AchievementState>((set) => ({
  regularAchievements: [],
  repeatAchievements: [],
  eventAchievements: [],
  isLoading: false,
  error: null,

  /**
   * 도전과제 목록을 가져오는 함수
   */
  fetchAchievements: async () => {
    set({ isLoading: true, error: null })

    try {
      // 실제 구현에서는 API 호출 등으로 데이터를 가져옴
      // 임시 데이터로 구현
      const regularAchievements: RegularAchievementType[] = [
        {
          id: 'regular-1',
          title: '출석 과제',
          description: '7일 연속 출석하기',
          category: '일반',
          status: '진행중',
          group: '출석',
          reward: {
            type: '포인트',
            amount: 100,
          },
        },
        {
          id: 'regular-2',
          title: '친구 초대 과제',
          description: '친구 5명 초대하기',
          category: '일반',
          status: '대기중',
          group: '초대',
          reward: {
            type: '포인트',
            amount: 200,
          },
        },
      ]

      const repeatAchievements: RepeatAchievementType[] = [
        {
          id: 'repeat-1',
          title: '도전과제도전과제도전과제도전과제도...',
          description: '매일 운동 인증하기',
          category: '반복',
          status: '진행중',
          cycle: '일간',
          progress: {
            current: 3,
            total: 7,
          },
          reward: {
            type: '포인트',
            amount: 50,
          },
        },
      ]

      const eventAchievements: EventAchievementType[] = [
        {
          id: 'event-1',
          theme: '[2024 크리스마스]',
          title: '루돌프 선물배달 작전',
          description: '크리스마스 특별 이벤트에 참여하세요!',
          category: '이벤트',
          status: '완료',
          startDate: '2024-12-01',
          endDate: '2024-12-25',
          progress: {
            current: 3,
            total: 3,
          },
          reward: {
            type: '아이템',
            amount: 1,
          },
        },
        {
          id: 'event-2',
          theme: '[2025 신년]',
          title: '행복 뉴이어~ 안녕, 2024년',
          description: '새해 맞이 특별 이벤트',
          category: '이벤트',
          status: '진행중',
          startDate: '2025-01-01',
          endDate: '2025-03-15',
          progress: {
            current: 1,
            total: 3,
          },
          reward: {
            type: '포인트',
            amount: 300,
          },
        },
        {
          id: 'event-3',
          theme: '[2025 발렌타인]',
          title: '사랑의 러닝 챌린지',
          description: '발렌타인 특별 러닝 이벤트',
          category: '이벤트',
          status: '진행중',
          startDate: '2025-02-01',
          endDate: (() => {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 2)
            return tomorrow.toISOString().split('T')[0]
          })(),
          progress: {
            current: 0,
            total: 2,
          },
          reward: {
            type: '포인트',
            amount: 150,
          },
        },
        {
          id: 'event-4',
          theme: '[2025 봄맞이]',
          title: '봄맞이 건강 챌린지',
          description: '봄을 맞아 건강한 습관 만들기',
          category: '이벤트',
          status: '대기중',
          startDate: '2025-03-01',
          endDate: '2025-03-31',
          progress: {
            current: 2,
            total: 4,
          },
          reward: {
            type: '포인트',
            amount: 500,
          },
        },
        {
          id: 'event-5',
          theme: '[완료된 이벤트]',
          title: '완료된 테스트 이벤트',
          description: '이 이벤트는 완료 상태입니다',
          category: '이벤트',
          status: '완료',
          startDate: '2025-01-01',
          endDate: '2025-01-31',
          progress: {
            current: 5,
            total: 5,
          },
          reward: {
            type: '포인트',
            amount: 1000,
          },
        },
      ]

      set({
        regularAchievements,
        repeatAchievements,
        eventAchievements,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '도전과제를 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
      })
    }
  },

  /**
   * 도전과제 상태를 업데이트하는 함수
   *
   * @param id - 도전과제 ID
   * @param status - 업데이트할 상태
   */
  updateAchievementStatus: (id: string, status: '진행중' | '완료' | '대기중') => {
    set((state) => {
      const updatedRegular = state.regularAchievements.map((achievement) =>
        achievement.id === id ? { ...achievement, status } : achievement,
      )

      const updatedRepeat = state.repeatAchievements.map((achievement) =>
        achievement.id === id ? { ...achievement, status } : achievement,
      )

      const updatedEvent = state.eventAchievements.map((achievement) =>
        achievement.id === id ? { ...achievement, status } : achievement,
      )

      return {
        regularAchievements: updatedRegular,
        repeatAchievements: updatedRepeat,
        eventAchievements: updatedEvent,
      }
    })
  },
}))
