import { SingleEvent } from "@/types";

interface MyVeeventCardProps {
  event: SingleEvent;
}

export default function MyVeeventCard({ event }: MyVeeventCardProps) {
  return (
    <div
      className="relative flex flex-col justify-between w-full max-h-[180px] min-h-[100px] rounded-[var(--vv-border-radius)] bg-gradient-to-br from-white via-primary-50 to-primary-100 border border-primary-200 shadow-sm overflow-hidden"
      style={{ letterSpacing: "0.04em" }}
    >
      
      <div className="relative z-20 flex h-full justify-between">
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="text-[12px] font-extrabold text-primary-600 uppercase tracking-tight text-center leading-tight bg-primary-950/10 backdrop-blur-sm py-4 px-2 h-full items-center justify-center flex flex-col">
            {event.name}
          </div>
          {/* {event.artist && (
            <div className="text-primary-400 text-xs font-mono mt-0.5">{event.artist}</div>
          )} */}
        </div>
        <div className="flex flex-col justify-center items-center px-2">
          <div className="text-primary-600 text-[10px] font-semibold tracking-widest uppercase text-center">
            {event.address}
          </div>
          <div className="text-primary-800 text-base font-extrabold leading-none text-center">
            {new Date(event.date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}