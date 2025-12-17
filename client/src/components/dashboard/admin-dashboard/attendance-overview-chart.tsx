'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from 'recharts';
import type { AttendanceOverview } from '@/types/dashboard.type';

interface AttendanceOverviewChartProps {
    data: AttendanceOverview;
}

const chartConfig = {
    present: {
        label: 'Present',
        color: 'hsl(var(--chart-1))',
    },
    late: {
        label: 'Late',
        color: 'hsl(var(--chart-2))',
    },
    absent: {
        label: 'Absent',
        color: 'hsl(var(--chart-3))',
    },
    onLeave: {
        label: 'On Leave',
        color: 'hsl(var(--chart-4))',
    },
} satisfies ChartConfig;

export function AttendanceOverviewChart({ data }: AttendanceOverviewChartProps) {
    const chartData = [
        { name: 'Present', value: data.present, fill: 'hsl(var(--chart-1))' },
        { name: 'Late', value: data.late, fill: 'hsl(var(--chart-2))' },
        { name: 'Absent', value: data.absent, fill: 'hsl(var(--chart-3))' },
        { name: 'On Leave', value: data.onLeave, fill: 'hsl(var(--chart-4))' },
    ].filter((item) => item.value > 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Today's Attendance</CardTitle>
                <CardDescription>
                    {data.presentPercentage.toFixed(1)}% attendance rate
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={80}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
