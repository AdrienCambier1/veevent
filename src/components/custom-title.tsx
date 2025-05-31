interface CustomTitleProps {
  title: string;
  description: string;
}

export default function CustomTitle({ title, description }: CustomTitleProps) {
  return (
    <div className="flex flex-col gap-1 w-fit">
      <div className="flex gap-2 items-center">
        <div className="w-4 h-[1px] bg-[var(--secondary-green)]" />
        <p className="text-[var(--secondary-green)] font-semibold">
          {description}
        </p>
      </div>
      <h2>{title}</h2>
    </div>
  );
}
