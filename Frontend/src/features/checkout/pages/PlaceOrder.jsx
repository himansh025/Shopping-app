import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Backward compatibility route for /placedOrder/:id
 * Forwards directly to the unified /checkout?buyNow=:id page
 */
export function PlaceOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      navigate(`/checkout?buyNow=${id}`, { replace: true });
    } else {
      navigate("/checkout", { replace: true });
    }
  }, [id, navigate]);

  return (
    <div className="flex justify-center items-center h-64 w-full">
      <div className="text-center text-slate-500 font-medium animate-pulse">
        Preparing your checkout...
      </div>
    </div>
  );
}

export default PlaceOrder;
