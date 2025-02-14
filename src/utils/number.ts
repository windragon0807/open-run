export function getRandomNumber(min: number, max: number) {
  // Math.floor로 소수점 이하를 버리고 정수값만 반환
  // min과 max 값을 포함하는 랜덤한 숫자를 생성
  return Math.floor(Math.random() * (max - min + 1)) + min
}
