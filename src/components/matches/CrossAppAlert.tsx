
import { Globe } from "lucide-react";

const CrossAppAlert = () => {
  return (
    <div className="mb-4 bg-emerald-50 text-emerald-800 rounded-lg p-3 text-sm border border-emerald-200">
      <p className="flex items-center gap-1.5">
        <Globe className="h-4 w-4 text-emerald-500" />
        <span>
          <strong>Cross-App Activity Tracking:</strong> We're analyzing your activity across
          partner apps to provide better personalized matches.
        </span>
      </p>
    </div>
  );
};

export default CrossAppAlert;
