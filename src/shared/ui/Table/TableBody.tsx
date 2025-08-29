import { memo, type FC } from "react"
import { TableRow } from "./TableRow"
import { TableCell } from "./TableCell"
import type { TableBodyProps } from "./types"

export const TableBody: FC<TableBodyProps> = memo(
	({ body, onRowClick, withIndication, indicatedColumnIndex }) => {
		return (
			<tbody>
				{body.map((row, idx) => (
					<TableRow
						key={idx}
						onClick={onRowClick ? () => onRowClick(row, idx) : undefined}
					>
						{row.map((cell, cellIdx) =>
							cellIdx === 0 ? (
								<th
									scope="row"
									key={cellIdx}
									className="px-6 py-4 font-medium text-gray-500 whitespace-nowrap"
								>
									{cell}
								</th>
							) : (
								<TableCell
									withIndication={
										withIndication && indicatedColumnIndex?.includes(cellIdx)
									}
									key={cellIdx}
								>
									{cell}
								</TableCell>
							),
						)}
					</TableRow>
				))}
			</tbody>
		)
	},
)

TableBody.displayName = "TableBody"
