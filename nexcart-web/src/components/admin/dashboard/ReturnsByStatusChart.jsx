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
  APPROVED: "#2F7D68",
  REJECTED: "#8B6B63",
  REQUESTED: "#A64B45",
};

const getStatusColor = (status, index) => {
  const normalized = String(status || "").toUpperCase();

  return (
    STATUS_COLORS[normalized] ||
    ["#2F7D68", "#8B6B63", "#A64B45"][index % 3]
  );
};

const ReturnsByStatusChart = ({ data = [] }) => {
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
              No return activity yet
            </p>
            <p className="mt-1 text-xs text-[#92969e]">
              Return request activity will appear here.
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

export default ReturnsByStatusChart;