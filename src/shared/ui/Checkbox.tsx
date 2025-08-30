import clsx from "clsx"
import { type InputHTMLAttributes } from "react"

interface CheckboxProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	disabled?: boolean
	label?: string
	checked?: boolean
	className?: string
	onChange?: (value: boolean) => void
	focusRingColor?: string
}

export const Checkbox = ({
	disabled,
	label,
	className,
	id,
	checked,
	onChange,
	focusRingColor = "focus:ring-indigo-200",
	...props
}: CheckboxProps) => {
	const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

	return (
		<div className="flex items-center">
			<input
				{...props}
				checked={checked}
				onChange={(e) => onChange?.(e.target.checked)}
				id={checkboxId}
				type="checkbox"
				disabled={disabled}
				className={clsx(
					"min-w-4 min-h-4 rounded-sm border border-gray-300 bg-indigo-300",
					"focus:outline-none focus:ring-2 focus:ring-offset-2",
					focusRingColor,
					checked && "bg-indigo-300 border-purple-100",
					"transition duration-150 ease-in-out",
					disabled && [
						"opacity-60 cursor-not-allowed",
						"bg-gray-100 border-gray-300",
						checked && "bg-gray-400 border-gray-400",
					],
					className,
				)}
			/>
			{label && (
				<label
					htmlFor={checkboxId}
					className={clsx(
						"ms-2 text-sm font-medium text-gray-600 cursor-pointer",
						disabled && "opacity-60 cursor-not-allowed text-gray-500 ",
					)}
				>
					{label}
				</label>
			)}
		</div>
	)
}
