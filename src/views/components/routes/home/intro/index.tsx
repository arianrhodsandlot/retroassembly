import clsx from 'clsx'
import { AnimatePresence, type TargetAndTransition, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { SpatialNavigation } from '../../../../lib/spatial-navigation'
import { showBannerAtom } from '../../../atoms'
import { useRouterHelpers } from '../../../hooks/use-router-helpers'
import { introVisibleAtom } from './atoms'
import { Banner } from './banner'
import { Footer } from './footer'
import { MainButtons } from './main-buttons'

export function Intro() {
  const [introVisible, setIntroVisible] = useAtom(introVisibleAtom)
  const [showBanner] = useAtom(showBannerAtom)
  const { navigateToPlatform } = useRouterHelpers()

  function onAnimationComplete(animation: TargetAndTransition) {
    if (animation.opacity) {
      SpatialNavigation.focus('intro')
    } else {
      navigateToPlatform()
    }
  }

  useEffect(() => {
    setIntroVisible(true)
  }, [setIntroVisible])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.removeProperty('overflow')
    }
  }, [])

  return (
    <AnimatePresence>
      {introVisible ? (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className={clsx(
            'intro absolute inset-x-0 bottom-0 z-10 flex flex-col overflow-auto bg-black/70 text-center text-white',
            showBanner ? 'lg:top-8' : 'top-0',
          )}
          exit={{ opacity: 0, scale: 1.2 }}
          initial={{ opacity: 0, scale: 1.2 }}
          onAnimationComplete={onAnimationComplete}
        >
          <Banner />
          <MainButtons />
          <Footer />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
