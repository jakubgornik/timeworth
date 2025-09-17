interface InfoRowProps {
  label: string;
  value?: string;
}

export const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="flex items-center justify-between gap-4 p-3">
    <div className="w-32 text-xs text-muted-foreground">{label}</div>
    <div className="flex-1">
      <div className="text-sm">
        {value || <span className="text-muted-foreground">Not specified</span>}
      </div>
    </div>
  </div>
);
