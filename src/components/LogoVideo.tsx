import { useEffect, useRef } from 'react'

type LogoVideoProps = {
  src: string
  className?: string
}

export default function LogoVideo({ src, className = '' }: LogoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Explicitly set muted properties in DOM to satisfy autoplay policies
    video.defaultMuted = true
    video.muted = true

    let isPlaying = false

    const play = async () => {
      if (isPlaying) return
      try {
        await video.play()
        isPlaying = true
      } catch (err) {
        console.warn('Autoplay failed or was interrupted, waiting for interaction:', err)
        const resume = () => {
          if (!isPlaying) {
            video.play()
              .then(() => { isPlaying = true })
              .catch(() => {})
          }
          document.removeEventListener('pointerdown', resume)
          document.removeEventListener('keydown', resume)
        }
        document.addEventListener('pointerdown', resume, { once: true })
        document.addEventListener('keydown', resume, { once: true })
      }
    }

    // Try playing immediately
    void play()

    // Also attempt playing when loaded or ready in case it wasn't ready
    const handleCanPlay = () => {
      void play()
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadeddata', handleCanPlay)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadeddata', handleCanPlay)
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={className}
      aria-label="Lumenara Technologies logo animation"
    />
  )
}

