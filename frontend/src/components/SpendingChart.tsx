import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

interface SpendingData {
  month: string;
  amount: number;
}

interface Props {
  data: SpendingData[];
}

const formatCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }

  return `₹${value}`;
};

const SpendingChart = ({
  data
}: Props) => {

  const chartData = data.map(
    (item) => ({
      ...item,
      label: new Date(
        `${item.month}-01`
      ).toLocaleDateString(
        "en-IN",
        {
          month: "short"
        }
      )
    })
  );

  return (
    <div className="h-77.5 w-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <AreaChart
          data={chartData}
          margin={{
            top: 15,
            right: 10,
            left: 0,
            bottom: 0
          }}
        >

          <defs>

            <linearGradient
              id="spendingGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#6366f1"
                stopOpacity={0.28}
              />

              <stop
                offset="100%"
                stopColor="#6366f1"
                stopOpacity={0.02}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 11
            }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 11
            }}
            tickFormatter={formatCurrency}
            width={55}
          />

          <Tooltip
            cursor={{
              stroke: "#c7d2fe",
              strokeWidth: 1
            }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              boxShadow:
                "0 10px 30px rgba(15, 23, 42, 0.08)"
            }}
            labelStyle={{
              color: "#64748b",
              fontSize: "11px",
              marginBottom: "4px"
            }}
            formatter={(value) => [
              `₹${Number(value).toLocaleString(
                "en-IN"
              )}`,
              "Spending"
            ]}
          />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="#6366f1"
            strokeWidth={3}
            fill="url(#spendingGradient)"
            dot={{
              r: 4,
              fill: "#ffffff",
              stroke: "#6366f1",
              strokeWidth: 2
            }}
            activeDot={{
              r: 6,
              strokeWidth: 3
            }}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
};

export default SpendingChart;