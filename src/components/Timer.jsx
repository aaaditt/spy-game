import { useEffect, useRef, useState } from 'react'
import './Timer.css'

/**
 * Timer — circular SVG countdown ring.
 *
 * Props:
 *   totalSeconds  {number}   Total seconds to count down from (required)
 *   onExpire      {Function} Called once when time reaches 0 (optional)
 *   paused        {boolean}  Pause the countdown externally (optional)
 */
export default function Timer({ totalSeconds, onExpire, paused = false }) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const onExpireRef = useRef(onExpire)

  // Keep callback ref fresh without restarting the effect
  useEffect(() => { onExpireRef.current = onExpire }, [onExpire])

  // Restart when totalSeconds prop changes
  useEffect(() => {
    setRemaining(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    if (paused || remaining <= 0) return

    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(id)
          onExpireRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [paused, remaining, totalSeconds]) // re-subscribe if paused flips or restarts

  // ── SVG ring geometry ───────────────────────────────────────────
  const SIZE        = 200          // SVG viewport size
  const STROKE      = 10           // ring stroke width
  const RADIUS      = (SIZE - STROKE) / 2
  const CIRCUMF     = 2 * Math.PI * RADIUS
  const progress    = totalSeconds > 0 ? remaining / totalSeconds : 0
  const dashOffset  = CIRCUMF * (1 - progress)

  // ── Display ─────────────────────────────────────────────────────
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0')
  const secs = String(remaining % 60).padStart(2, '0')

  const isWarning = remaining > 0 && remaining <= 30
  const isDone    = remaining === 0

  return (
    <div
      className={[
        'timer-root',
        isWarning ? 'timer-warning' : '',
        isDone    ? 'timer-done'    : '',
      ].join(' ')}
      role="timer"
      aria-label={`Time remaining: ${mins}:${secs}`}
      aria-live="off"
    >
      <svg
        className="timer-svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        aria-hidden="true"
      >
        {/* ── Definitions: gradients & glow filter ── */}
        <defs>
          <linearGradient id="timer-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="timer-ring-warn" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <filter id="timer-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Track ring ── */}
        <circle
          className="timer-track"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
        />

        {/* ── Progress ring ── */}
        <circle
          className="timer-progress"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          stroke={isWarning ? 'url(#timer-ring-warn)' : 'url(#timer-ring-grad)'}
          strokeLinecap="round"
          strokeDasharray={CIRCUMF}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          filter="url(#timer-glow)"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
        />

        {/* ── Inner glow disc (warning state) ── */}
        {isWarning && (
          <circle
            className="timer-inner-glow"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS - STROKE / 2 - 4}
            fill="rgba(239,68,68,0.06)"
          />
        )}
      </svg>

      {/* ── Time label ── */}
      <div className="timer-label" aria-hidden="true">
        <span className="timer-digits">
          {mins}<span className="timer-colon">:</span>{secs}
        </span>
        {isWarning && !isDone && (
          <span className="timer-alert-text">Hurry up!</span>
        )}
        {isDone && (
          <span className="timer-alert-text timer-done-text">Time's up!</span>
        )}
      </div>
    </div>
  )
}
