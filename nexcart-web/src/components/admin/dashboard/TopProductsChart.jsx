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

const TopProductsChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name:
      item.productName?.length > 22
        ? `${item.productName.substring(0, 22)}...`
        : item.productName,
    quantitySold: Number(item.quantitySold || 0),
  }));

  return (
    <div className="w-full">
      {chartData.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-[#4f5660]">
              No product sales yet
            </p>
            <p className="mt-1 text-xs text-[#92969e]">
              Best-performing products will appear here.
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
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                  fill: "#858b94",
                }}
                axisLine={false}
                tickLine={false}
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
                  `${Number(value).toLocaleString("en-IN")}`,
                  "Units sold",
                ]}
              />

              <Bar
                dataKey="quantitySold"
                name="Units sold"
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

export default TopProductsChart;