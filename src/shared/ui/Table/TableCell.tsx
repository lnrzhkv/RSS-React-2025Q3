import { memo, useEffect, useState, type FC, type ReactNode } from "react"
import { usePrevious } from "./usePrevious"
import clsx from "clsx"
export const TableCell: FC<{ children: ReactNode; withIndication?: boolean }> =
	memo(({ children, withIndication }) => {
		const previous = usePrevious(children)

		const [isShowIndication, setIsShowIndication] = useState(false)

		useEffect(() => {
			if (previous && previous !== children && withIndication) {
				setIsShowIndication(true)
				setTimeout(() => {
					setIsShowIndication(false)
				}, 700)
			}
		}, [children, previous, withIndication])

		return (
			<td
				className={clsx(
					"px-6 py-4",
					isShowIndication
						? "text-lime-700 bg-lime-100 outline-lime-200"
						: "text-gray-500",
				)}
			>
				{children}
			</td>
		)
	})

TableCell.displayName = "TableCell"
