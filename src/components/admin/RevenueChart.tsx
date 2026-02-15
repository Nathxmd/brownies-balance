"use client";

import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
} from "recharts";

interface RevenueData {
  date: string;
  amount: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; payload: RevenueData }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length && label) {
    const date = new Date(label);
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg border-zinc-100">
        <p className="text-xs font-semibold text-zinc-500 mb-1">
          {date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
        <p className="text-lg font-bold text-zinc-900">
          Rp {payload[0].value?.toLocaleString('id-ID')}
        </p>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888', fontSize: 12 }}
            minTickGap={30}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888', fontSize: 12 }}
            tickFormatter={(value) => `Rp ${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#f97316"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
