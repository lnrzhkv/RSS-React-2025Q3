import { useState, useMemo, useCallback, type FC, memo } from "react"
import { TableHead } from "./TableHead"
import { TableBody } from "./TableBody"
import type { SortOrder, TableProps } from "./types"
import clsx from "clsx"

export const Table: FC<TableProps> = memo(
	({
		data,
		onRowClick,
		className,
		withIndication = false,
		indicatedColumnIndex,
	}) => {
		const [sortBy, setSortBy] = useState<string | null>(null)
		const [order, setOrder] = useState<SortOrder>("asc")

		const sortedBody: (string | number)[][] = useMemo(() => {
			if (!sortBy || !data.sortingKeys?.includes(sortBy)) return data.body
			const idx = data.head.indexOf(sortBy)
			return [...data.body].sort((a, b) => {
				const aValue = a[idx]
				const bValue = b[idx]
				if (typeof aValue === "number" && typeof bValue === "number") {
					return order === "asc" ? aValue - bValue : bValue - aValue
				}
				const aStr = String(aValue)
				const bStr = String(bValue)
				if (aStr === bStr) return 0
				if (order === "asc") return aStr > bStr ? 1 : -1
				return aStr < bStr ? 1 : -1
			})
		}, [data.body, data.head, sortBy, order, data.sortingKeys])

		const handleSort = useCallback(
			(key: string) => {
				if (sortBy === key) {
					setOrder((prev) => (prev === "asc" ? "desc" : "asc"))
				} else {
					setSortBy(key)
					setOrder("asc")
				}
			},
			[sortBy],
		)

		return (
			<div
				className={clsx(
					"relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-400 mt-2.5 ",
					className,
				)}
			>
				<table className="w-full text-sm text-left rtl:text-right text-gray-400 bg-indigo-600">
					<TableHead
						head={data.head}
						sortingKeys={data.sortingKeys}
						sortBy={sortBy}
						order={order}
						onSort={handleSort}
					/>
					<TableBody
						withIndication={withIndication}
						indicatedColumnIndex={indicatedColumnIndex}
						head={data.head}
						body={sortedBody}
						onRowClick={onRowClick}
					/>
				</table>
			</div>
		)
	},
)

Table.displayName = "Table"
