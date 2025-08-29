import clsx from "clsx"
import { memo, type ButtonHTMLAttributes, type ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: ReactNode
	size?: "base" | "default"
}

export const Button = memo(
	({
		children,
		icon,
		disabled,
		size = "default",
		className,
		...props
	}: ButtonProps) => {
		return (
			<button
				{...props}
				disabled={disabled}
				className={clsx(
					"inline-block rounded-full border-2 font-semibold uppercase leading-normal",
					"transition duration-150 ease-in-out focus:outline-none focus:ring-0",

					size === "default" && "px-4 pb-2 pt-2  text-base w-fit",
					size === "base" && "px-4 pb-3 pt-2.5 text-sm w-fit",

					!disabled && [
						"border-indigo-400 text-indigo-400",
						"hover:border-indigo-500 hover:bg-indigo-300 hover:bg-opacity-10 hover:text-indigo-500",
						"focus:border-indigo-500 focus:text-indigo-500",
						"active:border-indigo-700 active:text-indigo-700",
					],

					disabled && [
						"opacity-40 cursor-default",
						"border-gray-500 text-gray-500",
					],

					className,
				)}
			>
				<span className="flex items-center justify-center space-x-2">
					{icon && <span>{icon}</span>}
					<span>{children}</span>
				</span>
			</button>
		)
	},
)

Button.displayName = "Button"
