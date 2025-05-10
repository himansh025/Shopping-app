import { ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackArrow({ className = "", size = 28 }) {
  const navigate = useNavigate();

  return (
    <ArrowLeftCircle
      onClick={() => navigate(-1)}
      className={`cursor-pointer hover:text-blue-600 transition-colors ${className}`}
      size={size}
    />
  );
}

export default BackArrow;
