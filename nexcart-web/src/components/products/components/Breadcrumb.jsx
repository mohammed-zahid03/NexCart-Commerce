import { ChevronRight } from "lucide-react";

const Breadcrumb = () => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">

      <span className="cursor-pointer transition hover:text-black">
        Home
      </span>

      <ChevronRight size={14} />

      <span className="cursor-pointer transition hover:text-black">
        Electronics
      </span>

      <ChevronRight size={14} />

      <span className="font-medium text-black">
        Products
      </span>

    </div>
  );
};

export default Breadcrumb;