interface Props {
  children: React.ReactNode;
}

export const Container = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto py-8">{children}</div>
    </div>
  );
};
