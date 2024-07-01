import { parseISO, format } from 'date-fns'

/* 백엔드 Response Format : '2024-07-01 14:10:23' */

export function formatDateString(dateString: string, formatString: string): string {
  // 'YYYY-MM-DD HH:mm:ss'를 ISO 포맷으로 변환
  const date = parseISO(dateString.replace(' ', 'T'))
  return format(date, formatString)
}
