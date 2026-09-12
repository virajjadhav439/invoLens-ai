import type {
  ValidationStatus
} from "../types/invoice";

interface Props {
  status: ValidationStatus;
}

const styles: Record<
  ValidationStatus,
  string
> = {
  VALID:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/10",

  WARNING:
    "bg-amber-50 text-amber-700 ring-amber-600/10",

  DUPLICATE:
    "bg-rose-50 text-rose-700 ring-rose-600/10",

  ANOMALY:
    "bg-violet-50 text-violet-700 ring-violet-600/10"
};

const StatusBadge = ({
  status
}: Props) => {

  return (
    <span className={`
      inline-flex
      items-center
      gap-1.5
      rounded-full
      px-2.5
      py-1
      text-[10px]
      font-bold
      tracking-wide
      ring-1
      ring-inset
      ${styles[status]}
    `}>

      <span className="
        h-1.5
        w-1.5
        rounded-full
        bg-current"
      />

      {status}

    </span>
  );
};

export default StatusBadge;