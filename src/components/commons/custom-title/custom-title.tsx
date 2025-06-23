import "./custom-title.scss";

interface CustomTitleProps {
  title: string;
  description: string;
}

export default function CustomTitle({ title, description }: CustomTitleProps) {
  return (
    <div className="custom-title">
      <div className="line-container">
        <div className="line" />
        <p>{description}</p>
      </div>
      <h2>{title}</h2>
    </div>
  );
}
