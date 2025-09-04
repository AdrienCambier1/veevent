import { SingleEvent } from "@/types";

interface MyVeeventCardProps {
  event: SingleEvent;
}

export default function MyVeeventCard({ event }: MyVeeventCardProps) {
  return (
    <div
      className="relative flex flex-col justify-between w-full max-h-[180px] min-h-[100px] rounded-[var(--vv-border-radius)] shadow-sm overflow-hidden"
      style={{ 
        letterSpacing: "0.04em",
        backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : 'linear-gradient(to bottom right, white, rgb(239 246 255), rgb(219 234 254))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ backgroundColor: 'rgba(18, 10, 189, 0.6)' }}
      ></div>
      
      <div className="relative z-20 flex h-full justify-between">
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="text-[12px] font-extrabold text-white uppercase tracking-tight text-center leading-tight backdrop-blur-sm py-4 px-2 h-full items-center justify-center flex flex-col">
            {event.name}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center px-2">
          <div className="text-white text-[10px] font-semibold tracking-widest uppercase text-center">
            {event.address}
          </div>
          <div className="text-white text-base font-extrabold leading-none text-center">
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