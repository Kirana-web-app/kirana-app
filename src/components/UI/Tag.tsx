import { FC } from "react";

interface TagProps {
  label: string;
  onRemove: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}

const Tag: FC<TagProps> = ({
  label,
  onRemove,
  variant = "primary",
  size = "sm",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      case "secondary":
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
      case "success":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
      case "danger":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      default:
        return "bg-primary/10 text-primary hover:bg-primary/20";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "md":
        return "px-3 py-1.5 text-sm";
      default:
        return "px-2 py-1 text-xs";
    }
  };

  return (
    <span
      className={`border border-primary inline-flex items-center gap-1 font-medium rounded-full ${getSizeClasses()} ${getVariantClasses()}`}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors"
      >
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </span>
  );
};

export default Tag;
