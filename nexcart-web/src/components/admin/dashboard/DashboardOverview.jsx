import React from "react";
import { formatRevenue } from "../../../utils/formatPrice";

const DashboardOverview = ({
    title,
    amount,
    Icon,
    revenue = false,
    description = "",
    featured = false,
}) => {
    const convertedAmount = revenue
        ? Number(amount || 0).toFixed(2)
        : amount ?? 0;

    return (
        <div
            className={`
                group
                relative
               rounded-[14px]
                border
                border-[#e3e1dc]
                bg-white
                p-5
                transition-all
                duration-200
                hover:-translate-y-[1px]
                hover:border-[#d4d1ca]
               hover:shadow-[0_8px_22px_rgba(20,20,20,0.045)]
                ${featured ? "min-h-[154px]" : "min-h-[126px]"}
            `}
        >
            <div className="flex items-start justify-between">

                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#f4f3f0]
                    "
                >
                    <Icon className="text-[18px] text-[#25272b]" />
                </div>

                {featured && (
                    <span className="text-[17px] text-[#8b8d91]">
                        →
                    </span>
                )}
            </div>

            <div className="mt-4">

                <p className="text-[12px] font-medium text-[#626873]">
                    {title}
                </p>

                <h3
                    className={`
                        mt-1
                        font-semibold
                        tracking-[-0.9px]
                        text-[#111827]
                        ${featured ? "text-[30px]" : "text-[24px]"}
                    `}
                >
                    {revenue ? "₹" : ""}
                    {revenue
                        ? formatRevenue(convertedAmount)
                        : convertedAmount}
                </h3>

                {description && (
                    <p className="mt-1 text-[11px] text-[#92969e]">
                        {description}
                    </p>
                )}

            </div>
        </div>
    );
};

export default DashboardOverview;