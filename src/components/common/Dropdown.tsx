import { ReactNode, useEffect, useRef } from 'react'

interface DropdownProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function Dropdown({ isOpen, onClose, children }: DropdownProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-10" onClick={onClose} aria-hidden="true" />}
      <div
        ref={menuRef}
        className={`absolute right-0 mt-2 flex flex-col bg-white/95 dark:bg-gray-800/95 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl backdrop-blur-lg p-3 min-w-[200px] origin-top-right transform transition-[opacity,transform] duration-200 ${isOpen ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-95 pointer-events-none z-20'}`}
      >
        {children}
      </div>
    </>
  )
}

