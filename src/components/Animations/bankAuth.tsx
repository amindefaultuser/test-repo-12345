// src/components/LottiePlayer.tsx
import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import bank from '../../assets/animation/bank.json'


export default function LottiePlayer() {
  const container = useRef(null)

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: bank
    })
  }, [])

  return <div ref={container} style={{ width: 300, height: 300 }} />
}
