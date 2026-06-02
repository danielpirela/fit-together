// Individual Grid Cell for single user view
// Uses red for completed, gray for not completed

import { cn } from "@/shared/lib/utils";

interface IndividualGridCellProps {
	completed: boolean;
	size?: number;
	showBorder?: boolean;
}

export function IndividualGridCell({
	completed,
	size = 32,
	showBorder = true,
}: IndividualGridCellProps) {
	return (
		<div
			className={cn(
				"transition-colors duration-200",
				completed ? "bg-red-completion" : "bg-gray-200",
				showBorder && "border border-gray-300",
			)}
			style={{ width: size, height: size }}
		/>
	);
}
