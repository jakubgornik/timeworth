interface SelectionOverlayProps {
  selectionInfo: {
    duration: number;
  };
}

export function SelectionOverlay({ selectionInfo }: SelectionOverlayProps) {
  // Calculate duration in hours (duration is in 15-minute slots)
  const durationInHours = (selectionInfo.duration * 15) / 60;

  return (
    <div
      className="absolute bg-teal-600/20 border-2 border-teal-500 rounded-sm shadow-sm backdrop-blur-sm z-[9999] pointer-events-none"
      style={{
        top: "4px",
        left: "4px",
        right: "4px",
        height: `${selectionInfo.duration * 25 - 8}px`,
      }}
    >
      <div className="h-full flex items-center justify-center">
        <div className="bg-slate-800/90 px-3 py-1 rounded-full shadow-sm border border-teal-500">
          <span className="text-teal-400 font-medium text-xs">
            {durationInHours}h
          </span>
        </div>
      </div>
    </div>
  );
}
