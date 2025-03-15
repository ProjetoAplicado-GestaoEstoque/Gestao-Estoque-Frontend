'use client'

import { useState } from 'react'
import SignUp from './SignUp'
import SignIn from './SignIn'

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <section className="flex flex-col justify-center items-center h-screen w-full p-6">
      {isSignIn ? (
        <SignIn onClick={() => setIsSignIn(!isSignIn)} />
      ) : (
        <SignUp onClick={() => setIsSignIn(!isSignIn)} />
      )}
    </section>
  )
}
