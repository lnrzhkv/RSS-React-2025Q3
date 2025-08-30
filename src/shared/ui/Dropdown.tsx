import clsx from "clsx"
import { useState, useRef, useEffect, memo } from "react"

export interface DropdownOption<T = string | number> {
	value: T
	label: string
}

interface DropdownProps {
	options: DropdownOption[]
	value?: string | number
	onChange?: (value: string | number) => void
	placeholder?: string
	disabled?: boolean
	className?: string
}

export const Dropdown = memo(
	({
		options,
		value,
		onChange,
		placeholder,
		disabled = false,
		className,
	}: DropdownProps) => {
		const [isOpen, setIsOpen] = useState(false)
		const dropdownRef = useRef<HTMLDivElement>(null)

		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					dropdownRef.current &&
					!dropdownRef.current.contains(event.target as Node)
				) {
					setIsOpen(false)
				}
			}

			document.addEventListener("mousedown", handleClickOutside)
			return () => document.removeEventListener("mousedown", handleClickOutside)
		}, [])

		const selectedOption = options.find((option) => option.value === value)

		const handleSelect = (option: DropdownOption) => {
			onChange?.(option.value)
			setIsOpen(false)
		}

		return (
			<div ref={dropdownRef} className={clsx("relative w-auto", className)}>
				<button
					type="button"
					disabled={disabled}
					onClick={() => !disabled && setIsOpen(!isOpen)}
					className={clsx(
						"w-full px-4 py-2 rounded-md border-2 border-gray-400 text-left",
						"text-gray-500",
						"focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400",
						"transition duration-150 ease-in-out",
						"flex items-center justify-between",
						disabled && [
							"opacity-60 cursor-not-allowed",
							"bg-gray-100 text-gray-500",
						],
					)}
				>
					<span className="truncate">
						{selectedOption?.label || placeholder}
					</span>
					<svg
						className={clsx(
							"w-4 h-4 ml-2 transition-transform",
							isOpen && "transform rotate-180",
						)}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>

				{isOpen && (
					<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
						<div className="py-1">
							{options.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => handleSelect(option)}
									className={clsx(
										"w-full px-4 py-2 text-left transition-colors duration-150",
										"text-gray-500 hover:bg-gray-100",
										value === option.value && "bg-indigo-100 text-indigo-500",
									)}
								>
									{option.label}
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		)
	},
)

Dropdown.displayName = "Dropdown"
