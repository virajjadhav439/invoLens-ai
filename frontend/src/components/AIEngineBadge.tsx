"use client";

import { Activity, Sparkles } from "lucide-react";
import { NoiseBackground } from "@/components/ui/noise-background";

const AIEngineBadge = () => {
  return (
    <NoiseBackground
      containerClassName="
        w-full
        rounded-2xl
        p-[1px]
        transition-all
        duration-300
        hover:scale-[1.015]
        hover:-translate-y-0.5
      "
      gradientColors={[
        "rgb(129, 140, 248)",
        "rgb(96, 165, 250)",
        "rgb(192, 132, 252)",
      ]}
      noiseIntensity={0.12}
      speed={0.08}
      animating={true}
    >
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-[15px]
          bg-white
          px-4
          py-4
          shadow-sm
          transition-all
          duration-300
          hover:shadow-md
        "
      >
        {/* Soft decorative glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-10
            -top-10
            h-24
            w-24
            rounded-full
            bg-indigo-100/50
            blur-2xl
            transition-all
            duration-500
            group-hover:scale-150
          "
        />

        {/* Header */}

        <div className="relative flex items-center gap-3">
          {/* AI Icon */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-sm
              border
              border-slate-200
              bg-white
              text-indigo-600
              shadow-sm
              transition-transform
              duration-300
              group-hover:scale-110
            "
          >
            <Sparkles
              size={17}
              strokeWidth={1.8}
            />
          </div>

          {/* Text */}

          <div className="min-w-0 flex-1">
            <p
              className="
                text-xs
                font-semibold
                tracking-tight
                text-slate-800
              "
            >
              AI Engine
            </p>

            <p
              className="
                mt-0.5
                text-[10px]
                text-slate-400
              "
            >
              Invoice intelligence
            </p>
          </div>

          {/* Activity */}

          <Activity
            size={15}
            className="
              shrink-0
              text-indigo-400
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />
        </div>

        {/* Status */}

        <div
          className="
            relative
            mt-4
            flex
            items-center
            gap-2
          "
        >
          {/* Pulsing status dot */}

          <span className="relative flex h-2 w-2">
            <span
              className="
                absolute
                inline-flex
                h-full
                w-full
                animate-ping
                rounded-full
                bg-emerald-400
                opacity-60
              "
            />

            <span
              className="
                relative
                inline-flex
                h-2
                w-2
                rounded-full
                bg-emerald-500
              "
            />
          </span>

          <span
            className="
              text-[10px]
              font-medium
              text-slate-500
            "
          >
            Ready to process invoices
          </span>
        </div>
      </div>
    </NoiseBackground>
  );
};

export default AIEngineBadge;