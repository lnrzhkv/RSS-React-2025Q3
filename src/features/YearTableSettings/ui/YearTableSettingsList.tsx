import { Checkbox } from "../../../shared/ui/Checkbox"
import clsx from "clsx"

export const YearTableSettingsList = ({
	columnRenderStruct,
	handleColumnActiveChange,
}: {
	columnRenderStruct: {
		keyof: string
		label: string
		checked: boolean
		disabled: boolean
	}[]
	handleColumnActiveChange: (
		colSetting: {
			keyof: string
			label: string
			checked: boolean
			disabled: boolean
		},
		value: boolean,
	) => void
}) => {
	return (
		<div
			className={clsx(
				"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4",
				"max-h-96 overflow-y-auto",
				"bg-gray-100  border border-gray-200",
			)}
		>
			{columnRenderStruct.map((colSetting) => (
				<div
					key={colSetting.keyof}
					className={clsx(
						"flex items-center p-3 rounded-md",
						"transition-colors duration-200",
						colSetting.checked
							? "bg-indigo-50 border border-indigo-200"
							: "bg-white border border-gray-200",
						"hover:bg-indigo-100/50",
					)}
				>
					<Checkbox
						{...colSetting}
						onChange={(value) => handleColumnActiveChange(colSetting, value)}
						className={clsx("text-indigo-600 focus:ring-indigo-500")}
					/>
				</div>
			))}
		</div>
	)
}
