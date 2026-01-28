"use client";

import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
    AreaChart,
    Area,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

interface ChartViewProps {
    data: any[];
    visualizationTypes?: string[];
}

export default function ChartView({ data, visualizationTypes = [] }: ChartViewProps) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return null;
        const keys = Object.keys(data[0]);

        const numericKey = keys.find((k) => {
            const isNumeric = typeof data[0][k] === "number";
            const isId = k.toLowerCase().includes("id");
            return isNumeric && !isId; // Only pick it if it's a number AND not an ID
        });

        const finalValueKey =
            numericKey || keys.find((k) => typeof data[0][k] === "number");

        const labelKey = keys.find((k) => typeof data[0][k] === "string") || keys[0];

        return {
            labelKey: labelKey as string,
            valueKey: finalValueKey as string,
            isValid: !!finalValueKey,
        };
    }, [data]);

    if (!chartData?.isValid) {
        return (
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
                <p>Run a query with numeric data to see charts.</p>
            </div>
        );
    }

    // Determine which charts to show
    let showBar = visualizationTypes.includes("bar");
    let showPie = visualizationTypes.includes("pie");
    const showLine = visualizationTypes.includes("line");
    const showArea = visualizationTypes.includes("area");

    // Fallback if no specific charts requested or array is empty: show Bar & Pie as default (existing behavior)
    if (!showBar && !showPie && !showLine && !showArea) {
        showBar = true;
        showPie = true;
    }

    const activeChartsCount = [showBar, showPie, showLine, showArea].filter(Boolean).length;

    return (
        <div className={`grid grid-cols-1 ${activeChartsCount > 1 ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
            {showBar && (
                <div className="h-[350px] w-full">
                    <h4 className="text-sm font-medium mb-4 text-center">Bar Analysis</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey={chartData.labelKey} fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Bar
                                dataKey={chartData.valueKey}
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {showPie && (
                <div className="h-[350px] w-full">
                    <h4 className="text-sm font-medium mb-4 text-center">Distribution</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey={chartData.valueKey}
                                nameKey={chartData.labelKey}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {showLine && (
                <div className="h-[350px] w-full">
                    <h4 className="text-sm font-medium mb-4 text-center">Trend Analysis</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey={chartData.labelKey} fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Line type="monotone" dataKey={chartData.valueKey} stroke="#8b5cf6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {showArea && (
                <div className="h-[350px] w-full">
                    <h4 className="text-sm font-medium mb-4 text-center">Area Analysis</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey={chartData.labelKey} fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Area type="monotone" dataKey={chartData.valueKey} stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
