import { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'

export interface errorState {
  message: string | null
}

let subject = new BehaviorSubject<errorState>({
  message: null,
})

export const useError = () => {
  const [error, setErrorObject] = useState(subject.value)

  useEffect(() => {
    const subscription = subject.subscribe((error) => {
      setErrorObject(error)
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  function setError(message: string) {
    subject.next({
      message: message,
    })
  }

  return { error, setError }
}
