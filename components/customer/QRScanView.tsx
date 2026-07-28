'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { QrCode, Info, RefreshCw, Sparkles, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QRScanView: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTableNum, setSelectedTableNum] = useState('4');
  const [isScanning, setIsScanning] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [useLiveCamera, setUseLiveCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setUseLiveCamera(true);
      toast({
        type: 'success',
        title: 'Camera Stream Active',
        description: 'Point your camera at a table QR code'
      });
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. Using simulator mode.');
      setUseLiveCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setUseLiveCamera(false);
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSimulateScan = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      setShowFlash(true);
      
      toast({
        type: 'success',
        title: 'QR Code Decoded',
        description: `Connected to Table T${selectedTableNum}. Loading visual menu...`
      });

      setTimeout(() => {
        setShowFlash(false);
        setIsScanning(false);
        stopCamera();
        router.push(`/menu/t${selectedTableNum}`);
      }, 500);

    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-serif font-bold text-ink">Table QR scanner</h1>
          <p className="text-xs text-ink-soft font-medium mt-0.5">Unlock the visual menu, place group orders, and summon captains.</p>
        </div>
        <Button
          variant={useLiveCamera ? 'primary' : 'outline'}
          size="sm"
          onClick={useLiveCamera ? stopCamera : startCamera}
          className="text-xs"
        >
          {useLiveCamera ? 'Stop Camera' : 'Use Camera'}
        </Button>
      </div>

      {/* Main Viewport Card */}
      <Card className="relative p-0 overflow-hidden bg-stone-900 border border-line/40 h-[420px] flex flex-col justify-between text-white rounded-2xl">
        {/* Live Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
            useLiveCamera ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        <AnimatePresence>
          {showFlash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-30"
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>

        {/* Viewport overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-black/20">
          <div className="w-52 h-52 relative border-2 border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
            <span className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary -mt-1 -ml-1 rounded-tl-md" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary -mt-1 -mr-1 rounded-tr-md" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary -mb-1 -ml-1 rounded-bl-md" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary -mb-1 -mr-1 rounded-br-md" />

            <div className={`absolute left-2 right-2 h-0.5 bg-primary shadow-[0_0_8px_var(--color-primary)] ${
              isScanning ? 'animate-[bounce_2s_infinite]' : 'top-1/2'
            }`} />

            {!useLiveCamera && (
              <QrCode className={`w-16 h-16 ${isScanning ? 'text-white/60 scale-95 animate-pulse' : 'text-white/30'}`} />
            )}
          </div>

          <p className="text-xs font-semibold text-white/90 tracking-wide mt-6 leading-relaxed max-w-xs drop-shadow">
            {isScanning 
              ? 'Decoding table token...' 
              : (useLiveCamera ? 'Point camera at table QR sticker' : 'Align Plateful sticker QR code in frame')}
          </p>

          {cameraError && (
            <p className="text-[11px] text-amber-400 font-medium mt-2 bg-black/60 px-3 py-1 rounded-full">
              {cameraError}
            </p>
          )}
        </div>

        {/* Top bar indicators inside camera view */}
        <div className="flex justify-between items-center px-4 py-3 bg-black/40 backdrop-blur-xs z-20 w-full text-[10px] uppercase font-bold tracking-wider text-white/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-success rounded-full animate-ping" />
            <span>Camera Active</span>
          </div>
          <div className="flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Beep on scan</span>
          </div>
        </div>

        {/* Simulator controller bar */}
        <div className="p-4 bg-black/60 backdrop-blur-xs z-20 w-full border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-left">
              <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider block">Simulate Table</span>
              <select
                value={selectedTableNum}
                onChange={e => setSelectedTableNum(e.target.value)}
                disabled={isScanning}
                className="text-xs bg-stone-800 border border-white/10 rounded px-2 py-1 w-full text-white outline-none mt-1"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                  <option key={n} value={n}>Table T{n} (Spice Route)</option>
                ))}
              </select>
            </div>
            
            <Button
              variant="primary"
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="flex gap-2 items-center text-xs h-10 px-5 self-end"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Scan QR Code</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Notice Box */}
      <Card className="bg-bg-alt/25 border border-line flex gap-3 items-start !p-4">
        <Info className="w-5 h-5 text-ink-soft mt-0.5 flex-shrink-0" />
        <div className="text-xs text-ink-soft leading-normal space-y-1 text-left">
          <span className="font-bold text-ink">How to Dine in Plateful Outlets</span>
          <p>
            Plateful uses instant table stickers. Scanning the table QR opens group baskets, letting you browse menu ratings and split bills with your tableside companions instantly.
          </p>
        </div>
      </Card>
    </div>
  );
};
