import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const TopSellersChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name:
      item.sellerName?.length > 22
        ? `${item.sellerName.substring(0, 22)}...`
        : item.sellerName,
    revenue: Number(item.revenue || 0),
  }));

  return (
    <div className="w-full">
      {chartData.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center">
          <div className="max-w-[260px] text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F3F0] text-[#59616B]">
              <span className="text-sm">—</span>
            </div>

            <p className="mt-3 text-sm font-medium text-[#4f5660]">
              No seller sales data yet
            </p>

            <p className="mt-1 text-xs leading-5 text-[#92969e]">
              Seller performance will appear here once sellers begin
              generating sales.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 8,
                right: 18,
                left: 8,
                bottom: 8,
              }}
              barCategoryGap="22%"
            >
              <CartesianGrid
                stroke="#EAE8E2"
                strokeDasharray="0"
                horizontal={false}
              />

              <XAxis
                type="number"
                tick={{
                  fontSize: 11,
                  fill: "#858b94",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <YAxis
                type="category"
                dataKey="name"
                width={145}
                tick={{
                  fontSize: 11,
                  fill: "#59616B",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{ fill: "#F7F6F2" }}
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #E5E2DC",
                  borderRadius: "10px",
                  boxShadow: "0 8px 24px rgba(20,20,20,0.06)",
                  fontSize: "12px",
                }}
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />

              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="#263442"
                radius={[0, 4, 4, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TopSellersChart;