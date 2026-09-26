import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const SalesOverTimeChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    date: item.date,
    revenue: Number(item.revenue || 0),
  }));

  return (
    <div className="w-full">
      {chartData.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-[#4f5660]">
              No sales data yet
            </p>
            <p className="mt-1 text-xs text-[#92969e]">
              Revenue activity will appear here as orders are placed.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 12,
                right: 12,
                left: 0,
                bottom: 4,
              }}
            >
              <CartesianGrid
                stroke="#EAE8E2"
                strokeDasharray="0"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 11,
                  fill: "#858b94",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
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

              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #E5E2DC",
                  borderRadius: "10px",
                  boxShadow: "0 8px 24px rgba(20,20,20,0.06)",
                  fontSize: "12px",
                }}
                labelStyle={{
                  color: "#171717",
                  marginBottom: "4px",
                }}
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#263442"
                strokeWidth={2}
                fill="#263442"
                fillOpacity={0.055}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#263442",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SalesOverTimeChart;