import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    Play, 
    Pause, 
    Headphones,
    Radio
} from 'lucide-react';

export interface AudioChapter {
    timestamp: string;
    seconds: number;
    title: string;
    targetSectionId?: string;
}

export interface ExecutiveAudioBriefingProps {
    postTitle?: string;
    durationSeconds?: number;
    chapters?: AudioChapter[];
    onTelemetry?: (action: string, metadata?: Record<string, unknown>) => void;
}

const DEFAULT_CHAPTERS: AudioChapter[] = [
    { timestamp: "00:00", seconds: 0, title: "Executive Problem Space & Manual Drag", targetSectionId: "sec-problem" },
    { timestamp: "00:45", seconds: 45, title: "LangGraph State Machine Architecture", targetSectionId: "sec-architecture" },
    { timestamp: "01:30", seconds: 90, title: "DPDP Act & Private AWS Mumbai VPC", targetSectionId: "sec-compliance" },
    { timestamp: "02:20", seconds: 140, title: "Financial ROI & 90-Day Mandate", targetSectionId: "sec-roi" }
];

export const ExecutiveAudioBriefing: React.FC<ExecutiveAudioBriefingProps> = ({
    postTitle = "Autonomous Enterprise AI Systems Teardown",
    durationSeconds = 180,
    chapters = DEFAULT_CHAPTERS,
    onTelemetry
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSeconds, setCurrentSeconds] = useState(0);
    const [playbackRate, setPlaybackRate] = useState<1 | 1.25 | 1.5 | 2>(1);
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);

    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const intervalRef = useRef<number | null>(null);

    // Audio synthesizer using Web Audio API to create subtle ambient focus audio
    const startAudioSynthesizer = () => {
        try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioCtx) return;

            if (!audioContextRef.current) {
                audioContextRef.current = new AudioCtx();
            }

            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }

            // Create gentle binaural / ambient pulse
            const ctx = audioContextRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(174, ctx.currentTime); // 174 Hz soothing focus frequency

            gain.gain.setValueAtTime(0.04, ctx.currentTime);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();

            oscillatorRef.current = osc;
            gainNodeRef.current = gain;
        } catch (e) {
            console.warn('Web Audio synthesis not supported', e);
        }
    };

    const stopAudioSynthesizer = () => {
        if (oscillatorRef.current) {
            try {
                oscillatorRef.current.stop();
                oscillatorRef.current.disconnect();
            } catch {
                // safely ignored
            }
            oscillatorRef.current = null;
        }
    };

    const togglePlay = () => {
        if (!isPlaying) {
            setIsPlaying(true);
            startAudioSynthesizer();
            onTelemetry?.('audio_briefing_started', { title: postTitle });
        } else {
            setIsPlaying(false);
            stopAudioSynthesizer();
            onTelemetry?.('audio_briefing_paused', { currentSeconds });
        }
    };

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = window.setInterval(() => {
                setCurrentSeconds(prev => {
                    const next = prev + playbackRate;
                    if (next >= durationSeconds) {
                        setIsPlaying(false);
                        stopAudioSynthesizer();
                        onTelemetry?.('audio_briefing_completed');
                        return durationSeconds;
                    }

                    // Update active chapter
                    const chapIdx = chapters.findIndex((c, i) => {
                        const nextChap = chapters[i + 1];
                        return next >= c.seconds && (!nextChap || next < nextChap.seconds);
                    });
                    if (chapIdx !== -1) setActiveChapterIndex(chapIdx);

                    return next;
                });
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            stopAudioSynthesizer();
        };
    }, [isPlaying, playbackRate, durationSeconds, chapters, onTelemetry]);

    const handleSeekChapter = (chapter: AudioChapter, idx: number) => {
        setCurrentSeconds(chapter.seconds);
        setActiveChapterIndex(idx);
        if (!isPlaying) {
            setIsPlaying(true);
            startAudioSynthesizer();
        }

        // Smooth scroll to target section if present
        if (chapter.targetSectionId) {
            const el = document.getElementById(chapter.targetSectionId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        onTelemetry?.('audio_chapter_jumped', {
            title: chapter.title,
            timestamp: chapter.timestamp
        });
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="interactive-asset my-8 p-5 md:p-6 rounded-2xl bg-gradient-to-r from-gray-950 via-[#0B0F19] to-gray-950 border border-indigo-500/30 shadow-2xl text-white font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                        <Headphones className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
                                <Radio className="h-2.5 w-2.5 " />
                                Executive Audio Briefing
                            </span>
                            <span className="text-[10px] font-mono text-white/40">
                                3-Min Compressed Synthesis
                            </span>
                        </div>
                        <h4 className="text-sm md:text-base font-bold text-white mt-0.5">
                            {postTitle}
                        </h4>
                    </div>
                </div>

                {/* Speed Toggle */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="flex items-center bg-white/5 p-1 rounded-lg border border-white/10 text-[11px] font-mono">
                        {([1, 1.25, 1.5, 2] as const).map(rate => (
                            <button
                                key={rate}
                                onClick={() => {
                                    setPlaybackRate(rate);
                                    onTelemetry?.('audio_speed_changed', { rate });
                                }}
                                className={`px-2 py-0.5 rounded transition-colors ${
                                    playbackRate === rate
                                        ? 'bg-indigo-600 text-white font-bold'
                                        : 'text-white/60 hover:text-white'
                                }`}
                            >
                                {rate}x
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Playback Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-[11px] font-mono text-white/50 mb-1.5">
                    <span>{formatTime(currentSeconds)}</span>
                    <span className="flex items-center gap-1 text-indigo-400">
                        {isPlaying ? 'Streaming Audio Briefing' : 'Paused'}
                    </span>
                    <span>{formatTime(durationSeconds)}</span>
                </div>

                <div 
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const pct = Math.max(0, Math.min(1, clickX / rect.width));
                        setCurrentSeconds(Math.round(pct * durationSeconds));
                        onTelemetry?.('audio_timeline_scrubbed', { pct });
                    }}
                    className="h-2 w-full bg-white/10 rounded-full cursor-pointer overflow-hidden relative"
                >
                    <div 
                        style={{ width: `${(currentSeconds / durationSeconds) * 100}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-200"
                    />
                </div>
            </div>

            {/* Playback Controls & Chapter Navigator */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Main Play Button */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={togglePlay}
                        className="h-11 w-11 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
                    >
                        {isPlaying ? (
                            <Pause className="h-5 w-5 fill-current" />
                        ) : (
                            <Play className="h-5 w-5 fill-current ml-0.5" />
                        )}
                    </button>

                    <div className="flex items-center gap-1">
                        {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50].map((h, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    height: isPlaying ? [10, h * 0.3, 10] : 8
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.8,
                                    delay: i * 0.08
                                }}
                                className="w-1 bg-indigo-400/80 rounded-full"
                            />
                        ))}
                    </div>
                </div>

                {/* Chapters Quick Jump */}
                <div className="flex flex-wrap items-center gap-2 overflow-x-auto w-full md:w-auto">
                    {chapters.map((chap, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSeekChapter(chap, idx)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors border ${
                                activeChapterIndex === idx
                                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                                    : 'bg-white/5 text-white/60 hover:text-white border-white/5'
                            }`}
                        >
                            <span className="text-[10px] text-white/40">{chap.timestamp}</span>
                            <span>{chap.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
