// File: src/components/loader.tsx
import { useEffect, useState } from 'react'
import './loader.css'

interface LoaderProps {
  progress?: number
  text?: string
}

export default function Loader({ progress, text }: LoaderProps) {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '.'
        return prev + '.'
      })
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="loader-spinner">
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
        </div>
        <div className="loader-text">
          {text || 'Loading'}{dots}
        </div>
        {progress !== undefined && (
          <div className="loader-progress">
            <div className="loader-progress-bar">
              <div 
                className="loader-progress-fill" 
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              ></div>
            </div>
            <span className="loader-progress-text">{Math.round(progress)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}