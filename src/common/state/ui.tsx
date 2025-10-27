'use client'
import React, { createContext, useContext, useState, useCallback } from 'react'

type UIState = {
  isAccountOpen: boolean
  isAIOpen: boolean
  openAccount: () => void
  closeAccount: () => void
  openAI: () => void
  closeAI: () => void
}

const UIContext = createContext<UIState | null>(null)

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAccountOpen, setAcc] = useState(false)
  const [isAIOpen, setAI] = useState(false)

  const openAccount = useCallback(() => setAcc(true), [])
  const closeAccount = useCallback(() => setAcc(false), [])
  const openAI = useCallback(() => setAI(true), [])
  const closeAI = useCallback(() => setAI(false), [])

  return (
    <UIContext.Provider value={{ isAccountOpen, isAIOpen, openAccount, closeAccount, openAI, closeAI }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
