export default function CustomTitle({ title, description }) {
  return (
    <div className="custom-title">
      <div className="flex gap-2 items-center">
        <div className="w-4 h-[1px] bg-[var(--primary-blue)]"></div>
        <p className="text-[var(--primary-blue)] font-bold">{description}</p>
      </div>
      <h2>{title}</h2>
    </div>
  );
}
