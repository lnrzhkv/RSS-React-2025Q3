import { createPortal } from "react-dom"
import clsx from "clsx"
import { memo, useEffect, useState, type ReactNode } from "react"

type ModalProps = {
	isOpen: boolean
	onClose: () => void
	children: ReactNode
	className?: string
	title: string
	actions?: ReactNode
}

export const Modal = memo(
	({
		isOpen,
		onClose,
		children,
		className,
		title = "Modal Title",
		actions,
	}: ModalProps) => {
		const [show, setShow] = useState(isOpen)

		useEffect(() => {
			if (isOpen) {
				setShow(true)
				document.body.style.overflow = "hidden"
			} else {
				setShow(false)
				document.body.style.overflow = ""
			}
			return () => {
				document.body.style.overflow = ""
			}
		}, [isOpen])

		if (!show) return null

		return createPortal(
			<div
				className={clsx(
					"fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200",
					isOpen ? "opacity-100" : "opacity-0",
				)}
				onClick={onClose}
			>
				<div
					className={clsx(
						"relative w-full max-w-2xl transform rounded-lg bg-gray-300 shadow-lg transition-all duration-200 ",
						isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0",
						className,
					)}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center justify-between border-b border-gray-300 p-4 ">
						<h3 className="text-xl font-semibold text-gray-500 ">{title}</h3>
						<button
							type="button"
							onClick={onClose}
							className="inline-flex h-8 w-8 items-center justify-center rounded-3xl text-gray-400 hover:bg-gray-200 hover:text-gray-500  "
						>
							<svg
								className="h-3 w-3"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M1 1l6 6m0 0 6 6M7 7l6-6M7 7 1 13"
								/>
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
					</div>

					<div className="p-4">{children}</div>

					{actions && (
						<div className="flex items-center justify-end gap-2 border-t border-gray-200 p-4 dark:border-gray-600">
							{actions}
						</div>
					)}
				</div>
			</div>,
			document.body,
		)
	},
)
