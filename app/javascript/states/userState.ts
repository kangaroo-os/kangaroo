import { useState, useEffect, SetStateAction } from 'react'
import { BehaviorSubject } from 'rxjs'
import User from '../models/User'

let subject = null

export const getUser = (): User => {
  if (!subject) {
    return undefined
  }

  return subject.value
}

export const useUser = () => {
  const [user, setUser] = useState(null)

  if (!subject) {
    subject = new BehaviorSubject(null)
  }

  useEffect(() => {
    const subscription = subject.subscribe((user: SetStateAction<User[]>) => {
      setUser(user)
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  function setCurrentUser(user: User) {
    subject.next(user)
  }

  function removeCurrentUser() {
    subject.next(null)
  }

  return { removeCurrentUser, setCurrentUser, user }
}
