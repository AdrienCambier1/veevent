export default function ItemList({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`flex flex-col`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <div key={index} className="flex items-center gap-2 w-full">
            {Icon && <Icon className="h-6 w-6 text-[var(--light-gray)]" />}
            <p
              className={`w-full dark-text py-3 ${
                !isLast && "border-b border-[var(--secondary-border-col)]"
              }`}
            >
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
