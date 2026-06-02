// Habit Grid Component - Shows 12 months of shared habit data
// Following Apple HIG with minimalist design

import { useMemo } from "react";
import { HabitGridCell } from "./HabitGridCell";
import {
	type SharedCompletion,
	getCellStatus,
	type DayOfWeek,
} from "@/core/entities";
import { cn } from "@/shared/lib/utils";

interface HabitGridProps {
	completions: SharedCompletion[];
	months?: number;
	cellSize?: number;
	className?: string;
}

const DAYS_OF_WEEK: DayOfWeek[] = [
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
];

const MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export function HabitGrid({
	completions,
	months = 12,
	cellSize = 32,
	className,
}: HabitGridProps) {
	// Generate dates for the grid
	const gridData = useMemo(() => {
		const today = new Date();
		const data: { date: string; dayOfWeek: DayOfWeek }[] = [];

		// Go back 'months' months
		const startDate = new Date(today);
		startDate.setMonth(startDate.getMonth() - months + 1);
		startDate.setDate(1);

		// Generate all dates
		const currentDate = new Date(startDate);
		while (currentDate <= today) {
			const dateStr = currentDate.toISOString().split("T")[0];
			const dayIndex = currentDate.getDay();
			// Convert JS day (0=Sunday) to our format (0=Monday)
			const dayOfWeekIndex = dayIndex === 0 ? 6 : dayIndex - 1;

			data.push({
				date: dateStr,
				dayOfWeek: DAYS_OF_WEEK[dayOfWeekIndex],
			});

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return data;
	}, [months]);

	// Create a map for quick lookup
	const completionMap = useMemo(() => {
		const map = new Map<string, SharedCompletion>();
		completions.forEach((c) => map.set(c.date, c));
		return map;
	}, [completions]);

	// Group by month
	const weeks = useMemo(() => {
		const result: { date: string; dayOfWeek: DayOfWeek }[][] = [];
		let currentWeek: { date: string; dayOfWeek: DayOfWeek }[] = [];

		gridData.forEach((item) => {
			if (item.dayOfWeek === "monday" && currentWeek.length > 0) {
				result.push(currentWeek);
				currentWeek = [];
			}
			currentWeek.push(item);
		});

		if (currentWeek.length > 0) {
			result.push(currentWeek);
		}

		return result;
	}, [gridData]);

	return (
		<div className={cn("overflow-x-auto", className)}>
			{/* Legend */}
			<div className="flex gap-4 mb-4 text-sm">
				<div className="flex items-center gap-2">
					<div className="flex">
						<div
							className="w-4 h-4 bg-green-primary"
							style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
						/>
						<div
							className="w-4 h-4 bg-purple-primary"
							style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
						/>
					</div>
					<span className="text-gray-600">Both completed</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 bg-purple-primary" />
					<span className="text-gray-600">Partner A didn't complete</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 bg-green-primary" />
					<span className="text-gray-600">Partner B didn't complete</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 bg-gray-200" />
					<span className="text-gray-600">Neither completed</span>
				</div>
			</div>

			{/* Grid */}
			<div className="flex gap-1">
				{/* Day labels */}
				<div className="flex flex-col gap-[2px] mr-2">
					{["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
						<div
							key={i}
							className="text-xs text-gray-400 flex items-center justify-end pr-1"
							style={{ height: cellSize }}
						>
							{day}
						</div>
					))}
				</div>

				{/* Weeks */}
				{weeks.map((week, weekIndex) => (
					<div key={weekIndex} className="flex flex-col gap-[2px]">
						{DAYS_OF_WEEK.map((dayOfWeek) => {
							const dayData = week.find((d) => d.dayOfWeek === dayOfWeek);
							if (!dayData) {
								return (
									<div
										key={dayOfWeek}
										className="bg-transparent"
										style={{ width: cellSize, height: cellSize }}
									/>
								);
							}

							const completion = completionMap.get(dayData.date);
							const status = getCellStatus(
								completion?.partnerACompleted ?? false,
								completion?.partnerBCompleted ?? false,
							);

return (
								<HabitGridCell
									key={dayOfWeek}
									status={status}
									size={cellSize}
								/>
							);
						})}
					</div>
				))}
			</div>

			{/* Month labels */}
			<div className="flex gap-1 mt-2">
				<div className="w-6" /> {/* Spacer for day labels */}
				{MONTH_NAMES.map((month) => (
					<div
						key={month}
						className="text-xs text-gray-400"
						style={{ width: cellSize * 4 + 12 }}
					>
						{month}
					</div>
				))}
			</div>
		</div>
	);
}
