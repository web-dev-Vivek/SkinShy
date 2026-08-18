import React, { useEffect, useRef, useState } from 'react';
import { createAnimatable, utils } from 'animejs';

/**
 * InteractiveLoader Component - Gamified Professional Level Design
 * A highly polished, interactive vector calibration game that keeps users
 * engaged during load states.
 * 
 * Features:
 * - 3 Progressive Calibration Stages: Static Lock, Orbital Track, and Wander Drift.
 * - Dynamic accuracy calculations based on distance.
 * - Streak/hold tracking to progress through stages.
 * - Professional gaming HUD metrics: System status, Stage, Accuracy, Drift offset.
 * - Interactive rotating crosshairs, laser scanlines, and grid graphics.
 */
export default function InteractiveLoader({
  message = "Loading...",
  compact = false,
  fullscreen = false
}) {
  const containerRef = useRef(null);
  const targetRef = useRef(null);
  const circleRef = useRef(null);

  // Game States
  const [stage, setStage] = useState(1); // 1 = Static, 2 = Orbit, 3 = Wander, 4 = Success/Optimized
  const [coords, setCoords] = useState({ x: '0.00', y: '0.00' });
  const [accuracy, setAccuracy] = useState(0);
  const [streak, setStreak] = useState(0); // Holds time in seconds
  const [isAligned, setIsAligned] = useState(false);
  const [targetOffset, setTargetOffset] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  // Refs for animation frame loop
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const streakRef = useRef(0);
  const stageRef = useRef(1);

  // Set initial mouse position to center screen to avoid weird jumps
  useEffect(() => {
    mouseRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const target = targetRef.current;
    const circleEl = circleRef.current;
    if (!container || !target || !circleEl) return;

    // Initialize animejs animatable for moving circle cursor
    const animatable = createAnimatable(circleEl, {
      x: 0,
      y: 0,
      ease: 'out(2.5)',
    });

    let animFrameId;
    let angle = 0;
    let lastTime = performance.now();

    const gameLoop = (now) => {
      const delta = (now - lastTime) / 1000; // in seconds
      lastTime = now;

      // 1. Calculate Target position depending on active stage
      const currentStage = stageRef.current;
      let nextOffset = { x: 0, y: 0 };

      if (currentStage === 2) {
        // Orbital Track: target moves in a smooth circle
        angle += delta * 1.5;
        nextOffset.x = Math.cos(angle) * (compact ? 12 : 24);
        nextOffset.y = Math.sin(angle) * (compact ? 12 : 24);
      } else if (currentStage === 3) {
        // Wander Drift: target wanders complexly
        angle += delta * 1.2;
        nextOffset.x = (Math.sin(angle * 1.6) * 0.7 + Math.cos(angle * 0.8) * 0.3) * (compact ? 15 : 35);
        nextOffset.y = (Math.cos(angle * 1.3) * 0.7 + Math.sin(angle * 0.5) * 0.3) * (compact ? 15 : 35);
      } else if (currentStage === 4) {
        // Success: lock target at center
        nextOffset = { x: 0, y: 0 };
      }

      targetOffsetRef.current = nextOffset;
      setTargetOffset(nextOffset);

      // 2. Fetch screen bounds to translate absolute pointer coords
      const rect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const wrapperCenterX = rect.left + rect.width / 2;
      const wrapperCenterY = rect.top + rect.height / 2;

      // Destination coordinates for moving circle (mouse screen position relative to target center wrapper)
      const destX = mouseRef.current.x - wrapperCenterX;
      const destY = mouseRef.current.y - wrapperCenterY;

      // Clamp coordinates so moving circle stays inside container bounds
      const limitX = containerRect.width / 2 - (compact ? 15 : 25);
      const limitY = containerRect.height / 2 - (compact ? 15 : 25);

      const clampedX = utils.clamp(destX, -limitX, limitX);
      const clampedY = utils.clamp(destY, -limitY, limitY);

      animatable.x(clampedX);
      animatable.y(clampedY);

      // 3. Compute accuracy based on distance between moving circle and active target circle
      const currentX = animatable.x();
      const currentY = animatable.y();
      const dx = currentX - nextOffset.x;
      const dy = currentY - nextOffset.y;
      const distance = Math.sqrt(dx * dx + dy * dy);


      // Calculate accuracy percentage
      const maxDistance = compact ? 80 : 150;
      const currentAccuracy = Math.max(0, 100 - (distance / maxDistance) * 100);
      setAccuracy(currentAccuracy);

      // Alignment check (close overlap threshold)
      const aligned = distance < (compact ? 2.5 : 4);
      setIsAligned(aligned);

      // Update coordinates display
      setCoords({
        x: aligned ? '0.00' : utils.roundPad(dx, 2),
        y: aligned ? '0.00' : utils.roundPad(dy, 2),
      });

      // 4. Update Streak Calibration hold progress
      if (currentStage < 4) {
        if (aligned) {
          streakRef.current = Math.min(100, streakRef.current + delta * (compact ? 45 : 35)); // Fills up progress
        } else {
          streakRef.current = Math.max(0, streakRef.current - delta * 20); // Decay alignment slowly
        }
        setStreak(streakRef.current);

        // Stage Completion check
        if (streakRef.current >= 100) {
          streakRef.current = 0;
          setStreak(0);
          const nextStage = currentStage + 1;
          stageRef.current = nextStage;
          setStage(nextStage);
        }
      }

      animFrameId = requestAnimationFrame(gameLoop);
    };

    const onPointerMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    // Bind pointermove listener globally
    window.addEventListener('pointermove', onPointerMove);
    animFrameId = requestAnimationFrame(gameLoop);

    setIsActive(true);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(animFrameId);
    };
  }, [compact]);

  // Calibration Stage Messaging
  const getStageName = () => {
    switch (stage) {
      case 1: return "STAGE 01: STATIC CODES";
      case 2: return "STAGE 02: ORBITAL FREQUENCY";
      case 3: return "STAGE 03: WANDER VECTOR";
      default: return "CALIBRATION SECURED";
    }
  };

  const getStageTask = () => {
    switch (stage) {
      case 1: return "CALIBRATING STATIC SOURCE VECTOR... HOLD CORE LOCK";
      case 2: return "ORBITAL WOBBLE DETECTED... CHASE & TRACK CORE SIGNAL";
      case 3: return "DYNAMIC DRIFT ACTIVE... STABILIZE DYNAMIC COORDINATES";
      default: return "ALL CORE CODES COMPLETED. OPTIMIZING DATABASE STREAM";
    }
  };

  const containerClasses = compact
    ? "relative w-full flex flex-col bg-[#0b0c0c] border border-[#2c2d2d] p-3 rounded-lg overflow-hidden select-none cursor-crosshair touch-none text-white font-mono"
    : fullscreen
      ? "fixed inset-0 w-screen h-screen z-50 flex flex-col items-center justify-center bg-[#070808] select-none cursor-crosshair overflow-hidden p-6 touch-none text-white font-mono"
      : "relative w-full min-h-[340px] flex flex-col bg-[#0b0c0c] border border-[#2c2d2d] p-5 sm:p-6 rounded-xl overflow-hidden select-none cursor-crosshair touch-none text-white font-mono";

  // Visual layout configurations
  const hudBorderColor = isAligned ? "border-white" : "border-white/10";
  const hudTextColor = isAligned ? "text-white" : "text-white/60";

  return (
    <div
      ref={containerRef}
      className={`${containerClasses} transition-all duration-300 ${isAligned ? 'shadow-[0_0_40px_rgba(255,255,255,0.08)] border-white/20' : 'shadow-2xl'
        }`}
    >
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="loader-hud-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loader-hud-grid)" />
        </svg>
      </div>

      {/* Sweeping radar scanner laser line */}
      <div className="absolute left-0 w-full h-[1px] bg-white/20 shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none animate-[scanLaser_3.5s_linear_infinite]" />

      {/* Header HUD Information */}
      <div className="flex justify-between items-center w-full pb-2 border-b border-white/10 z-10 text-[9px] sm:text-[10px] tracking-wider select-none mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAligned ? 'bg-white' : 'bg-white/40'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isAligned ? 'bg-white' : 'bg-white/30'}`}></span>
          </span>
          <span className="font-bold text-white/80">GRID CALIBRATION SYSTEM</span>
        </div>
        <div className={`font-bold transition-all duration-300 ${isAligned ? 'text-white' : 'text-white/40'}`}>
          {getStageName()}
        </div>
      </div>

      {/* Accuracy & Drift Metrics Row */}
      <div className="grid grid-cols-3 gap-2 w-full mb-3 z-10 text-center select-none">
        <div className="bg-[#141515] border border-white/5 rounded p-1.5 flex flex-col items-center">
          <span className="text-[8px] text-white/40 uppercase tracking-widest mb-0.5">accuracy</span>
          <span className={`text-[11px] sm:text-[12px] font-bold ${isAligned ? 'text-white text-shadow-glow' : 'text-white/80'}`}>
            {accuracy.toFixed(1)}%
          </span>
        </div>
        <div className="bg-[#141515] border border-white/5 rounded p-1.5 flex flex-col items-center">
          <span className="text-[8px] text-white/40 uppercase tracking-widest mb-0.5">lock strength</span>
          <span className="text-[11px] sm:text-[12px] font-bold text-white/80">
            {streak.toFixed(0)}%
          </span>
        </div>
        <div className="bg-[#141515] border border-white/5 rounded p-1.5 flex flex-col items-center">
          <span className="text-[8px] text-white/40 uppercase tracking-widest mb-0.5">lock status</span>
          <span className={`text-[11px] sm:text-[12px] font-bold uppercase transition-colors tracking-widest ${isAligned ? 'text-white font-extrabold' : 'text-white/30'
            }`}>
            {isAligned ? 'locked' : 'drift'}
          </span>
        </div>
      </div>

      {/* Main Coordinate displays & Center target */}
      <div className={`flex items-center justify-between gap-3 w-full z-10 ${compact ? 'my-1' : 'my-3'}`}>

        {/* X Box */}
        <div className="flex-1 flex flex-col items-center">
          <span className="text-[8px] text-white/40 uppercase tracking-wider mb-0.5 select-none">vector.x</span>
          <div className={`w-full bg-[#111212] border rounded text-center transition-all duration-300 ${isAligned ? 'border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'border-white/5 text-white/60'
            } ${compact ? 'py-2 text-[11px]' : 'py-3 text-[14px] sm:text-[16px]'}`}>
            {coords.x}
          </div>
        </div>

        {/* Dynamic target and crosshair area */}
        <div
          ref={targetRef}
          className={`relative flex items-center justify-center flex-shrink-0 transition-all duration-300 ${compact ? 'w-14 h-14' : 'w-24 h-24'
            }`}
        >
          {/* Outer rotating alignment grid ring */}
          <div className={`absolute rounded-full border border-dashed border-white/10 w-full h-full animate-[spin_10s_linear_infinite] ${isAligned ? 'border-white/20' : ''
            }`} />

          {/* Inner rotating reverse grid ring */}
          <div className={`absolute rounded-full border border-dotted border-white/5 w-[80%] h-[80%] animate-[spin_6s_linear_infinite_reverse] ${isAligned ? 'border-white/25' : ''
            }`} />

          {/* Reference Circle (The target is translated dynamically via game loop) */}
          <div
            className="absolute rounded-full transition-colors duration-300 flex items-center justify-center"
            style={{
              width: compact ? '24px' : '36px',
              height: compact ? '24px' : '36px',
              transform: `translate(${targetOffset.x}px, ${targetOffset.y}px)`,
              background: isAligned ? '#ffffff' : '#1a1b1b',
              border: isAligned ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.15)',
              boxShadow: isAligned ? '0 0 20px rgba(255,255,255,0.8)' : 'none'
            }}
          >
            {/* Center target dot */}
            <div className={`w-1 h-1 rounded-full ${isAligned ? 'bg-black' : 'bg-white/40'}`} />
          </div>

          {/* Moving Circle (Trails the cursor with inertia, absolute position centered) */}
          <div
            ref={circleRef}
            className={`circle absolute rounded-full pointer-events-none flex items-center justify-center mix-blend-difference`}
            style={{
              position: 'absolute',
              width: compact ? '28px' : '40px',
              height: compact ? '28px' : '40px',
              // Centered coordinate bounds layout
              left: compact ? '14px' : '28px',
              top: compact ? '14px' : '28px',
              opacity: isActive && !isAligned ? 0.95 : 0,
              background: 'rgba(255,255,255,0.85)',
              boxShadow: '0 0 12px rgba(255,255,255,0.4)',
              transform: 'translate(-50%, -50%)',
              transition: 'opacity 0.25s, transform 0.05s'
            }}
          >
            {/* Inner crosshair reticle on cursor */}
            <div className="w-1.5 h-1.5 rounded-full bg-black" />
          </div>
        </div>

        {/* Y Box */}
        <div className="flex-1 flex flex-col items-center">
          <span className="text-[8px] text-white/40 uppercase tracking-wider mb-0.5 select-none">vector.y</span>
          <div className={`w-full bg-[#111212] border rounded text-center transition-all duration-300 ${isAligned ? 'border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'border-white/5 text-white/60'
            } ${compact ? 'py-2 text-[11px]' : 'py-3 text-[14px] sm:text-[16px]'}`}>
            {coords.y}
          </div>
        </div>

      </div>

      {/* Calibration Progress Bar */}
      {stage < 4 && (
        <div className="w-full h-1 bg-[#141515] border border-white/5 rounded-full overflow-hidden mb-3 select-none">
          <div
            className="h-full bg-white transition-all duration-100 ease-out shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ width: `${streak}%` }}
          />
        </div>
      )}

      {/* Footer Calibration Status Ticker */}
      <div className="w-full text-center mt-auto z-10 pt-2 border-t border-white/10 select-none">
        {!compact && (
          <h4 className="text-[10px] uppercase font-bold text-white/70 tracking-widest mb-0.5">
            {message}
          </h4>
        )}
        <p className="text-[8px] sm:text-[9px] tracking-widest uppercase font-black transition-colors duration-300">
          {stage === 4 ? (
            <span className="text-white animate-pulse">★ STABILITY CALIBRATED. LAUNCH READY ★</span>
          ) : isAligned ? (
            <span className="text-white tracking-[0.15em] font-extrabold animate-pulse">▲ CORE LOCKED - HOLD POSITION ▲</span>
          ) : (
            <span className="text-white/40">{getStageTask()}</span>
          )}
        </p>
      </div>

      {/* CSS Animation classes */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scanLaser {
          0% { top: 0%; opacity: 0.1; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { top: 100%; opacity: 0.1; }
        }
        .text-shadow-glow {
          text-shadow: 0 0 6px rgba(255, 255, 255, 0.7);
        }
      `}} />
    </div>
  );
}
