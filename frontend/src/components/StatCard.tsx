import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconClass?: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass = "bg-indigo-50 text-indigo-600",
}: Props) => {
  return (
    <div
      className="
  group
  relative
  overflow-hidden
  rounded-2xl
  border
  border-slate-200
  bg-white
  p-5
  shadow-sm
  transition-all
  duration-300
  hover:-translate-y-0.5
  hover:scale-[1.01]
  hover:shadow-md
"
    >
      <div
        className="
        absolute
        -right-8
        -top-8
        h-24
        w-24
        rounded-full
        bg-indigo-50/50
        blur-2xl
        transition-all
        group-hover:bg-indigo-100
      "
      />

      <div
        className="
        relative
        flex
        items-start
        justify-between
      "
      >
        <div>
          <p
            className="
            text-xs
            font-medium
            text-slate-500
          "
          >
            {title}
          </p>

          <p
            className="
            mt-2
            text-2xl
            font-bold
            tracking-tight
            text-slate-900
          "
          >
            {value}
          </p>

          <p
            className="
            mt-1
            text-[11px]
            text-slate-400
          "
          >
            {subtitle}
          </p>
        </div>

        <div
          className={`
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          ${iconClass}
        `}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
