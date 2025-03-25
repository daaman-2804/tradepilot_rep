"use client"

import { Bar } from "react-chartjs-2"
import { Line } from "react-chartjs-2"
import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export function BarChart({
  data,
  options,
  ...props
}: {
  data: ChartData<"bar">
  options?: ChartOptions<"bar">
} & React.ComponentProps<typeof Bar>) {
  return <Bar data={data} options={options} {...props} />
}

export function LineChart({
  data,
  options,
  ...props
}: {
  data: ChartData<"line">
  options?: ChartOptions<"line">
} & React.ComponentProps<typeof Line>) {
  return <Line data={data} options={options} {...props} />
}

export function PieChart({
  data,
  options,
  ...props
}: {
  data: ChartData<"pie">
  options?: ChartOptions<"pie">
} & React.ComponentProps<typeof Pie>) {
  return <Pie data={data} options={options} {...props} />
}

