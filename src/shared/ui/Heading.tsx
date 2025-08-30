import clsx from "clsx"
import { type ReactNode } from "react"

interface HeadingProps {
	children: ReactNode
	className?: string
}

export const Heading = ({ children, className }: HeadingProps) => {
	return (
		<h1
			className={clsx(
				"text-center text-7xl font-bold uppercase text-neutral-500",
				className,
			)}
		>
			{children}
		</h1>
	)
}
