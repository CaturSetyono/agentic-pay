"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Play, Pause, RotateCcw, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import type { PlayerRef } from "@remotion/player";
import { PipelineComposition } from "./pipeline-composition";

// Dynamic import with ssr: false to prevent Next.js SSR hydration mismatches
const RemotionPlayer = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          height: "240px",
          display: "grid",
          placeItems: "center",
          background: "#0a0f1d",
          borderRadius: "6px",
          border: "1px solid rgba(226, 232, 240, 0.08)",
          color: "#94a3b8",
          fontFamily: "monospace",
          fontSize: "12px",
        }}
      >
        Initializing Remotion Engine...
      </div>
    ),
  }
);

interface PipelinePlayerProps {
  currentTab?: number;
}

export function PipelinePlayer({ currentTab }: PipelinePlayerProps) {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedStage, setSelectedStage] = useState<number>(-1); // -1 = loop all
  const [speed, setSpeed] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync with workspace tab if user clicks a tab
  useEffect(() => {
    if (currentTab !== undefined && playerRef.current) {
      if (currentTab === 0) {
        playerRef.current.seekTo(10);
      } else if (currentTab === 1) {
        playerRef.current.seekTo(50);
      } else if (currentTab === 2) {
        playerRef.current.seekTo(90);
      }
    }
  }, [currentTab]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const jumpToStage = (stage: number) => {
    setSelectedStage(stage);
    if (!playerRef.current) return;
    if (stage === -1) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
      setIsPlaying(true);
    } else if (stage === 0) {
      playerRef.current.seekTo(15);
    } else if (stage === 1) {
      playerRef.current.seekTo(55);
    } else if (stage === 2) {
      playerRef.current.seekTo(95);
    }
  };

  const restart = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    playerRef.current.play();
    setIsPlaying(true);
    setSelectedStage(-1);
  };

  return (
    <div
      style={{
        margin: "24px 0",
        borderRadius: "6px",
        border: "1px solid rgba(226, 232, 240, 0.08)",
        background: "var(--panel, #0e1526)",
        overflow: "hidden",
        boxShadow: "rgba(50, 50, 93, 0.12) 0px 15px 35px -5px, rgba(0, 0, 0, 0.07) 0px 5px 15px -5px",
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: isExpanded ? "1px solid rgba(226, 232, 240, 0.08)" : "none",
          background: "rgba(10, 15, 29, 0.6)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: "28px",
              height: "28px",
              borderRadius: "4px",
              background: "rgba(83, 58, 253, 0.15)",
              color: "#818cf8",
              border: "1px solid rgba(83, 58, 253, 0.3)",
            }}
          >
            <Sparkles size={15} />
          </span>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground, #f8fafc)" }}>
              Interactive Agent Lifecycle Reel (Remotion Engine)
            </div>
            <div style={{ fontSize: "10px", color: "var(--muted, #94a3b8)" }}>
              Real-time programmatic motion graphics simulating perception, policy, & PayPal settlement.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              borderRadius: "4px",
              border: "1px solid rgba(226, 232, 240, 0.08)",
              background: "transparent",
              color: "var(--muted, #94a3b8)",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} /> Collapse Reel
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Expand Reel
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Remotion Canvas */}
          <div style={{ width: "100%", background: "#0a0f1d" }}>
            <RemotionPlayer
              ref={playerRef}
              component={PipelineComposition}
              inputProps={{ activeStage: selectedStage }}
              durationInFrames={120}
              fps={30}
              compositionWidth={840}
              compositionHeight={280}
              style={{
                width: "100%",
                height: "auto",
                aspectRatio: "840 / 280",
                display: "block",
              }}
              controls={false}
              autoPlay
              loop
              playbackRate={speed}
            />
          </div>

          {/* Interactive Player Controls */}
          <div
            style={{
              padding: "10px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(10, 15, 29, 0.8)",
              borderTop: "1px solid rgba(226, 232, 240, 0.08)",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {/* Playback Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={togglePlay}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "4px",
                  background: isPlaying ? "rgba(83, 58, 253, 0.2)" : "#533afd",
                  border: "1px solid rgba(83, 58, 253, 0.5)",
                  color: "#f8fafc",
                  fontSize: "11px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                onClick={restart}
                title="Restart Animation"
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "28px",
                  height: "28px",
                  borderRadius: "4px",
                  border: "1px solid rgba(226, 232, 240, 0.08)",
                  background: "transparent",
                  color: "#94a3b8",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={13} />
              </button>

              <button
                onClick={() => setSpeed(speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid rgba(226, 232, 240, 0.08)",
                  background: "transparent",
                  color: "#94a3b8",
                  fontSize: "10px",
                  fontFamily: "monospace",
                  cursor: "pointer",
                }}
              >
                {speed}x
              </button>
            </div>

            {/* Quick Seek Stages */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "10px", color: "#64748b", marginRight: "4px" }}>
                Interactive Scrubber:
              </span>
              {[
                { label: "All (Loop)", stage: -1 },
                { label: "01 Audit", stage: 0 },
                { label: "02 Policy", stage: 1 },
                { label: "03 Settle", stage: 2 },
              ].map((item) => {
                const active = selectedStage === item.stage;
                return (
                  <button
                    key={item.stage}
                    onClick={() => jumpToStage(item.stage)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: active ? 600 : 400,
                      fontFamily: "monospace",
                      background: active ? "rgba(83, 58, 253, 0.25)" : "transparent",
                      border: active
                        ? "1px solid #533afd"
                        : "1px solid rgba(226, 232, 240, 0.08)",
                      color: active ? "#f8fafc" : "#94a3b8",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
