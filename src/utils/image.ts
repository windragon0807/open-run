/**
 * 이미지를 정사각형으로 자르는 함수
 */
export const cropSquareImage = (imageDataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        const { width, height } = img

        // 만약 height < width라면, height에 맞춰 정사각형을 만들어야 함
        const finalSize = Math.min(width, height)

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context를 가져올 수 없습니다.'))
          return
        }
        canvas.width = finalSize
        canvas.height = finalSize

        // 배경 투명
        ctx.clearRect(0, 0, finalSize, finalSize)

        // 이미지를 (0,0)에서 시작해서 정사각형만큼만 그림
        ctx.drawImage(img, 0, 0, finalSize, finalSize, 0, 0, finalSize, finalSize)

        const result = canvas.toDataURL('image/png')
        resolve(result)
      }

      img.onerror = () => {
        reject(new Error('이미지를 로드할 수 없습니다.'))
      }

      img.src = imageDataUrl
    } catch (error) {
      reject(error)
    }
  })
}
