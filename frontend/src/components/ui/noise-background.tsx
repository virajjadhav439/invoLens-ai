"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  MotionValue,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// Gradient Layer
// ─────────────────────────────────────────────

function GradientLayer({
  springX,
  springY,
  gradientColor,
  opacity,
  multiplier,
}: {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  gradientColor: string;
  opacity: number;
  multiplier: number;
}) {
  const x = useTransform(springX, (val) => val * multiplier);
  const y = useTransform(springY, (val) => val * multiplier);

  const background = useMotionTemplate`
    radial-gradient(
      circle at ${x}px ${y}px,
      ${gradientColor} 0%,
      transparent 50%
    )
  `;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        background,
      }}
    />
  );
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface NoiseBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  gradientColors?: string[];
  noiseIntensity?: number;
  speed?: number;
  backdropBlur?: boolean;
  animating?: boolean;
}

// ─────────────────────────────────────────────
// Noise Background
// ─────────────────────────────────────────────

export const NoiseBackground = ({
  children,
  className,
  containerClassName,

  gradientColors = [
    "rgb(255, 100, 150)",
    "rgb(100, 150, 255)",
    "rgb(255, 200, 100)",
  ],

  noiseIntensity = 0.2,
  speed = 0.1,
  backdropBlur = false,
  animating = true,
}: NoiseBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring movement
  const springX = useSpring(x, {
    stiffness: 100,
    damping: 30,
  });

  const springY = useSpring(y, {
    stiffness: 100,
    damping: 30,
  });

  // Top gradient strip movement
  const topGradientX = useTransform(
    springX,
    (val) => val * 0.1 - 50,
  );

  // Velocity
  const velocityRef = useRef({
    x: 0,
    y: 0,
  });

  const lastDirectionChangeRef = useRef(0);

  // ─────────────────────────────────────────
  // Initialize position
  // ─────────────────────────────────────────

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const rect = container.getBoundingClientRect();

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    x.set(centerX);
    y.set(centerY);
  }, [x, y]);

  // ─────────────────────────────────────────
  // Random velocity generator
  // ─────────────────────────────────────────

  const generateRandomVelocityRef = useRef(() => {
    const angle = Math.random() * Math.PI * 2;

    const magnitude =
      speed * (0.5 + Math.random() * 0.5);

    return {
      x: Math.cos(angle) * magnitude,
      y: Math.sin(angle) * magnitude,
    };
  });

  // Update velocity generator when speed changes
  useEffect(() => {
    generateRandomVelocityRef.current = () => {
      const angle = Math.random() * Math.PI * 2;

      const magnitude =
        speed * (0.5 + Math.random() * 0.5);

      return {
        x: Math.cos(angle) * magnitude,
        y: Math.sin(angle) * magnitude,
      };
    };

    velocityRef.current =
      generateRandomVelocityRef.current();
  }, [speed]);

  // ─────────────────────────────────────────
  // Animation
  // ─────────────────────────────────────────

  useAnimationFrame((time) => {
    if (!animating || !containerRef.current) {
      return;
    }

    const rect =
      containerRef.current.getBoundingClientRect();

    const maxX = rect.width;
    const maxY = rect.height;

    // Change direction randomly every 1.5–3 seconds
    if (
      time - lastDirectionChangeRef.current >
      1500 + Math.random() * 1500
    ) {
      velocityRef.current =
        generateRandomVelocityRef.current();

      lastDirectionChangeRef.current = time;
    }

    // Approximate frame time
    const deltaTime = 16;

    const currentX = x.get();
    const currentY = y.get();

    let newX =
      currentX +
      velocityRef.current.x * deltaTime;

    let newY =
      currentY +
      velocityRef.current.y * deltaTime;

    // Keep gradients slightly away from edges
    const padding = 20;

    // ─────────────────────────────────────────
    // Bounce / random direction
    // ─────────────────────────────────────────

    if (
      newX < padding ||
      newX > maxX - padding ||
      newY < padding ||
      newY > maxY - padding
    ) {
      const angle = Math.random() * Math.PI * 2;

      const magnitude =
        speed * (0.5 + Math.random() * 0.5);

      velocityRef.current = {
        x: Math.cos(angle) * magnitude,
        y: Math.sin(angle) * magnitude,
      };

      lastDirectionChangeRef.current = time;

      // Clamp position
      newX = Math.max(
        padding,
        Math.min(maxX - padding, newX),
      );

      newY = Math.max(
        padding,
        Math.min(maxY - padding, newY),
      );
    }

    x.set(newX);
    y.set(newY);
  });

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className={cn(
        // Clean transparent outer container
        // NO dark background
        // NO dark shadow
        "group relative overflow-hidden rounded-2xl bg-transparent p-px",

        // Optional backdrop blur
        backdropBlur &&
          "after:absolute after:inset-0 after:h-full after:w-full after:backdrop-blur-lg after:content-['']",

        containerClassName,
      )}
      style={
        {
          "--noise-opacity": noiseIntensity,
        } as React.CSSProperties
      }
    >
      {/* ─────────────────────────────────────
          Moving Gradient 1
      ───────────────────────────────────── */}

      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={
          gradientColors[0] ||
          "rgb(129, 140, 248)"
        }
        opacity={0.4}
        multiplier={1}
      />

      {/* ─────────────────────────────────────
          Moving Gradient 2
      ───────────────────────────────────── */}

      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={
          gradientColors[1] ||
          "rgb(96, 165, 250)"
        }
        opacity={0.3}
        multiplier={0.7}
      />

      {/* ─────────────────────────────────────
          Moving Gradient 3
      ───────────────────────────────────── */}

      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={
          gradientColors[2] ||
          gradientColors[0] ||
          "rgb(192, 132, 252)"
        }
        opacity={0.25}
        multiplier={1.2}
      />

      {/* ─────────────────────────────────────
          Top Gradient Strip
      ───────────────────────────────────── */}

      <motion.div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-1
          rounded-t-2xl
          opacity-80
          blur-sm
        "
        style={{
          background: `linear-gradient(
            to right,
            ${gradientColors.join(", ")}
          )`,
          x: animating ? topGradientX : 0,
        }}
      />

      {/* ─────────────────────────────────────
          Noise Pattern
      ───────────────────────────────────── */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <img
          src="https://assets.aceternity.com/noise.webp"
          alt=""
          className="
            h-full
            w-full
            object-cover
            opacity-(--noise-opacity)
          "
          style={{
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* ─────────────────────────────────────
          Content
      ───────────────────────────────────── */}

      <div
        className={cn(
          "relative z-10",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};