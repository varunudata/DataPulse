import React from 'react'
import recharts from "recharts"

import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const page = () => {
  return (
    <div>
        <div>Hello</div>
        <LineChart width={400} height={400}>
        <XAxis dataKey="name" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line type="monotone" dataKey="uv" stroke="#ff7300" />
        <Line type="monotone" dataKey="pv" stroke="#387908" />
        </LineChart>
    </div>
  )
}

export default page; 