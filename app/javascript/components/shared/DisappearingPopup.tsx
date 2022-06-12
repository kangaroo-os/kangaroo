import React, { useEffect, useRef } from 'react'
export const DisappearingPopup = ({ message, animate }: { message: string; animate: boolean }) => {
  const popupRef = useRef(null)
  function animateAgain() {
    if (popupRef.current) {
      popupRef.current.classList.remove('animate-slide')
      // trigger a DOM reflow
      popupRef.current.offsetHeight
      popupRef.current.classList.add('animate-slide')
    }
  }

  useEffect(() => {
    if (animate == true) {
      animateAgain()
    }
  }, [animateAgain])

  return (
    <div ref={popupRef} className="absolute -bottom-12 w-full animate-slide">
      <div className="py-3 px-5 bg-gray-200 rounded max-w-max mx-auto min-w-[400px]">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}

export default DisappearingPopup
