import clsx from "clsx"
import { memo, type InputHTMLAttributes, type ReactNode } from "react"
import { CloseIcon } from "./CloseIcon"

interface InputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	disabled?: boolean
	icon?: ReactNode
	value?: string
	onChange?: (value: string) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
	onClear: () => void
}

export const Input = memo(
	({
		disabled,
		className,
		icon,
		value,
		onChange,
		onKeyDown,
		onClear,
	}: InputProps) => {
		const hasIcon = Boolean(icon)
		const showClearButton = Boolean(value && onClear)

		return (
			<div className="relative w-full">
				<input
					type="text"
					value={value}
					onChange={(e) => onChange?.(e.target.value)}
					onKeyDown={onKeyDown}
					disabled={disabled}
					className={clsx(
						"w-full px-4 py-2 rounded-md border-2 ",
						"text-gray-500 placeholder-gray-400 border-gray-400",
						"focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400",
						"transition duration-150 ease-in-out",
						hasIcon && "pr-10",
						disabled && [
							"opacity-60 cursor-not-allowed",
							"bg-gray-100 text-gray-500",
						],
						className,
					)}
				/>

				{icon && !showClearButton && (
					<span className="absolute inset-y-0 right-4 flex items-center pl-3 pointer-events-none cursor-pointer z-0">
						{icon}
					</span>
				)}

				{showClearButton && (
					<button
						type="button"
						onClick={onClear}
						className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
						tabIndex={-1}
					>
						<CloseIcon />
					</button>
				)}
			</div>
		)
	},
)
