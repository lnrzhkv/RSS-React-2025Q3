import { memo, type FC } from "react"
import { TableRow } from "./TableRow"
import type { TableHeadProps } from "./types"

const SortSvg = memo(
	({ active, order }: { active: boolean; order: "asc" | "desc" }) => {
		if (active) {
			return (
				<svg
					width={14}
					height={14}
					className="text-gray-400"
					aria-hidden="true"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					{order === "asc" ? (
						<path d="M10 4l6 8H4l6-8z" />
					) : (
						<path d="M10 16l-6-8h12l-6 8z" />
					)}
				</svg>
			)
		}
		return (
			<span className="flex flex-col items-center gap-[2px]">
				<svg
					width={14}
					height={7}
					className="text-gray-400"
					aria-hidden="true"
					viewBox="0 0 20 7"
					fill="currentColor"
				>
					<path d="M10 0l6 7H4l6-7z" />
				</svg>
				<svg
					width={14}
					height={7}
					className="text-gray-400"
					aria-hidden="true"
					viewBox="0 0 20 7"
					fill="currentColor"
				>
					<path d="M10 7l-6-7h12l-6 7z" />
				</svg>
			</span>
		)
	},
)

SortSvg.displayName = "SortSvg"

export const TableHead: FC<TableHeadProps> = memo(
	({ head, sortingKeys = [], sortBy, order, onSort }) => (
		<thead className="text-xs text-indigo-400 uppercase sticky top-0 border-b-2 border-gray-400">
			<TableRow>
				{head.map((title) => {
					const sortable = sortingKeys.includes(title)
					return (
						<th
							key={title}
							scope="col"
							className={
								"px-6 py-3 select-none font-bold border-b dark:border-gray-700 border-gray-20 min-w-[80px]" +
								(sortable
									? " cursor-pointer hover:text-indigo-300 transition-colors"
									: "")
							}
							onClick={sortable ? () => onSort(title) : undefined}
						>
							<span className="flex items-center gap-2">
								{title}
								{sortable && (
									<SortSvg active={sortBy === title} order={order} />
								)}
							</span>
						</th>
					)
				})}
			</TableRow>
		</thead>
	),
)

TableHead.displayName = "TableHead"
