const validImages = new Set<string>()
const invalidImages = new Set<string>()

export async function imageLoaded(src: string) {
  if (validImages.has(src)) {
    return src
  }
  if (invalidImages.has(src)) {
    throw new Error('Image failed to load previously')
  }
  const img = new Image()
  img.src = src
  return await new Promise<string>((resolve, reject) => {
    img.addEventListener('load', () => {
      validImages.add(src)
      resolve(src)
    })
    img.addEventListener('error', (error) => {
      invalidImages.add(src)
      reject(new Error(`Failed to load image: ${src}`, { cause: error }))
    })
  })
}
