import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const STATUS_COLORS = {
  ACCEPTED: "#2F7D68",
  PROCESSING: "#718096",
  SHIPPED: "#7A718C",
  RETURNED: "#B27A32",
  CANCELLED: "#A64B45",
  DELIVERED: "#263442",
};

const getStatusColor = (status, index) => {
  const normalized = String(status || "").toUpperCase();

  return (
    STATUS_COLORS[normalized] ||
    ["#263442", "#2F7D68", "#718096", "#B27A32", "#7A718C"][index % 5]
  );
};

const OrdersByStatusChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name: item.status,
    value: Number(item.count || 0),
  }));

  return (
    <div className="w-full">
      {chartData.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-[#4f5660]">
              No order activity yet
            </p>
            <p className="mt-1 text-xs text-[#92969e]">
              Order status distribution will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={2}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={getStatusColor(entry.name, index)}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #E5E2DC",
                  borderRadius: "10px",
                  boxShadow: "0 8px 24px rgba(20,20,20,0.06)",
                  fontSize: "12px",
                }}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={7}
                wrapperStyle={{
                  fontSize: "11px",
                  color: "#59616B",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default OrdersByStatusChart;