import clsx from "clsx"
import { memo, type ReactNode } from "react"

interface SubheadingProps {
	children: ReactNode
	className?: string
}

export const Subheading = memo(({ children, className }: SubheadingProps) => {
	return (
		<h2
			className={clsx(
				"text-center text-2xl font-semibold text-neutral-500 mb-4",
				className,
			)}
		>
			{children}
		</h2>
	)
})

Subheading.displayName = "Subheading"
