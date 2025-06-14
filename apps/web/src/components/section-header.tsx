interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <header className="px-4 md:px-0 md:pl-4 h-16 py-4 w-full border-b bg-background md:bg-primary">
      <h1 className="md:text-2xl text-lg font-bold">{title}</h1>
    </header>
  );
}
