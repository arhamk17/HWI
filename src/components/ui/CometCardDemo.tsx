'use client';

import React from 'react';
import { CometCard, CometCardViewIndicator } from './comet-card';
import { ShieldCheck } from 'lucide-react';

export function CometCardDemo() {
  return (
    <div className="flex justify-center items-center py-12 px-4">
      <div style={{ width: '320px', height: '460px', position: 'relative' }}>
        <CometCard
          maxTilt={5}
          elevation={10}
          deptTheme={{
            start: '#D6001C',
            end: '#0066FF',
            glow: 'rgba(214, 0, 28, 0.4)',
          }}
          deptId="technical-team"
          isActive={true}
          showSheen={true}
          ariaLabel="Sushant Panchal — Lead Full-Stack Architect"
          className="rounded-[18px] border border-white/10 bg-[#0c0a12] p-5 flex flex-col justify-between"
        >
          {/* Lanyard punch */}
          <div className="w-10 h-1.5 rounded-full bg-black/60 border border-white/20 mx-auto mb-2" />

          {/* Top accent */}
          <div className="w-full h-0.5 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 mb-3" />

          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="font-black text-xs px-1.5 py-0.5 rounded bg-white/10 text-white">HWI</span>
              <span className="text-[10px] font-bold text-white tracking-wider">OFFICIAL CREDENTIAL</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              VERIFIED
            </span>
          </div>

          {/* Photo frame */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/60 border border-white/10 my-1">
            <img
              src="/images/team/Sushant.png"
              alt="Sushant Panchal"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[9px] text-white font-bold border border-white/20">
              <ShieldCheck size={11} className="text-emerald-400" />
              <span>OFFICIAL</span>
            </div>
            {/* Floating Circular VIEW Indicator */}
            <CometCardViewIndicator text="VIEW" />
          </div>

          {/* Details */}
          <div className="mt-2">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
              TECHNICAL TEAM // HEAD
            </div>
            <h3 className="text-base font-bold text-white">Sushant Panchal</h3>
            <p className="text-xs text-neutral-400">Lead Full-Stack Architect</p>
          </div>

          {/* Footer Barcode */}
          <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-neutral-500 font-mono">
            <span>CREDENTIAL ID</span>
            <span className="text-neutral-300 font-bold">HWI-2026-TEC-SUSHANT</span>
          </div>
        </CometCard>
      </div>
    </div>
  );
}
