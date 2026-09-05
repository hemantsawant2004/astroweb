import { useEffect, useRef, useState } from 'react'
import introVideo from '../assets/intro.mp4'

const MAX_DURATION_MS = 6000
const FADE_MS = 500

export default function IntroSplash() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)
  const videoRef = useRef(null)
  const dismissedRef = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(false)
      return
    }

    const dismiss = () => {
      if (dismissedRef.current) return
      dismissedRef.current = true
      setFading(true)
      setTimeout(() => setVisible(false), FADE_MS)
    }

    const timer = setTimeout(dismiss, MAX_DURATION_MS)
    const video = videoRef.current
    video?.addEventListener('ended', dismiss)

    return () => {
      clearTimeout(timer)
      video?.removeEventListener('ended', dismiss)
    }
  }, [])

  // Lock page scroll while the splash covers the screen -- otherwise the (often
  // much taller) page underneath stays scrollable, letting the real layout show
  // through/shift around behind the fixed overlay.
  useEffect(() => {
    if (!visible) return undefined
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [visible])

  if (!visible) return null

  const skip = () => {
    setFading(true)
    setTimeout(() => setVisible(false), FADE_MS)
  }

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden bg-cosmic-950 transition-opacity duration-500 ${
        fading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src={introVideo}
        className="absolute inset-0 h-full w-full object-contain"
        autoPlay
        muted
        playsInline
      />
      <button
        type="button"
        onClick={skip}
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white/70 backdrop-blur transition hover:border-gold-400 hover:text-white"
      >
        Skip
      </button>
    </div>
  )
}
