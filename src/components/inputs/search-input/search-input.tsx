import { Search } from "iconoir-react";
import "./search-input.scss";

interface SearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Effectuez une recherche",
}: SearchInputProps) {
  return (
    <div className="search-input">
      <Search className="icon-small" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
