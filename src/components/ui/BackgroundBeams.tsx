"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function BackgroundBeams() {
  const containerRef = useRef<HTMLDivElement>(null);
  const beamsRef = useRef<HTMLDivElement[]>([]);
  const numBeams = 40; // Increased number of beams for better effect

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    beamsRef.current = [];

    // Create beams
    for (let i = 0; i < numBeams; i++) {
      const beam = document.createElement("div");
      beam.className = "absolute h-[40rem] w-[1px] rotate-[20deg]";
      beam.style.background = "linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.2), transparent)";
      beam.style.left = `${Math.random() * 100}%`;
      beam.style.top = `${Math.random() * 100}%`;
      beam.style.transform = `rotate(${Math.random() * 360}deg)`;
      beam.style.filter = "blur(1px)";
      beam.style.opacity = "0";
      beam.style.animation = `beam-fade-in 2s ease-out forwards ${Math.random() * 2}s`;
      container.appendChild(beam);
      beamsRef.current.push(beam);
    }

    // Add animation keyframes
    const style = document.createElement("style");
    style.textContent = `
      @keyframes beam-fade-in {
        from {
          opacity: 0;
          transform: translateY(100%) rotate(var(--rotation));
        }
        to {
          opacity: 0.4;
          transform: translateY(0) rotate(var(--rotation));
        }
      }
    `;
    document.head.appendChild(style);

    // Mouse move effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      beamsRef.current.forEach((beam) => {
        const beamRect = beam.getBoundingClientRect();
        const beamCenterX = beamRect.left + beamRect.width / 2 - rect.left;
        const beamCenterY = beamRect.top + beamRect.height / 2 - rect.top;

        const distanceX = mouseX - beamCenterX;
        const distanceY = mouseY - beamCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
        const intensity = 1 - Math.min(distance / maxDistance, 1);

        beam.style.transform = `
          translate(${distanceX * intensity * 0.1}px, ${distanceY * intensity * 0.1}px)
          rotate(${beam.style.getPropertyValue("--rotation") || "0deg"})
        `;
      });
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      document.head.removeChild(style);
      beamsRef.current.forEach(beam => beam.remove());
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}