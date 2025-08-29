import { memo, type FC, type MouseEventHandler, type ReactNode } from "react"

type Props = {
	children: ReactNode
	onClick?: MouseEventHandler<HTMLTableRowElement>
}

export const TableRow: FC<Props> = memo(({ children, onClick }) => (
	<tr
		className="bg-gray-300 border-b border-gray-500
		 hover:bg-gray-200 transition-colors"
		onClick={onClick}
		style={onClick ? { cursor: "pointer" } : undefined}
	>
		{children}
	</tr>
))
