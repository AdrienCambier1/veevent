export default function MainTitle({ title }) {
  return (
    <div className="relative">
      <h1 className="text-center">{title}</h1>
      <div className="-z-10 left-0 -top-10 absolute w-fit h-fit flex">
        <div className="bg-[rgba(var(--primary-green-rgb),0.75)] h-20 w-20 rounded-full" />
        <div className="absolute top-10 -left-8 -z-10 bg-[rgba(var(--primary-blue-rgb),0.75)] h-14 w-14 rounded-full" />
      </div>
    </div>
  );
}
