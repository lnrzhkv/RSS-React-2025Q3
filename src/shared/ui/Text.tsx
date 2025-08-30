import clsx from "clsx"
import { type ReactNode } from "react"

interface TextProps {
	children: ReactNode
	className?: string
}

export const Text = ({ children, className }: TextProps) => {
	return (
		<div
			className={clsx(
				"max-w-full text-center flex justify-center items-center",
			)}
		>
			<p className={clsx("font-light text-neutral-500", className)}>
				{children}
			</p>
		</div>
	)
}
