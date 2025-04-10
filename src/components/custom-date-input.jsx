import { useRef } from "react";
import { Calendar } from "iconoir-react";

export default function CustomDateInput({ name, value, onChange }) {
  const dateInputRef = useRef(null);

  const handleIconClick = () => {
    dateInputRef.current.showPicker();
  };

  return (
    <div className="relative">
      <input
        ref={dateInputRef}
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className={`${!value && "text-[var(--light-gray)]"}`}
      />
      <div className="input-icon">
        <Calendar onClick={handleIconClick} />
      </div>
    </div>
  );
}
