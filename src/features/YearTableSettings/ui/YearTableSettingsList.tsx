import { memo } from "react"
import { Checkbox } from "../../../shared/ui/Checkbox"
import clsx from "clsx"
import type { ColumnSetting } from "../model/types"

export const YearTableSettingsList = memo(
	({
		columnRenderStruct,
		handleColumnActiveChange,
	}: {
		columnRenderStruct: ColumnSetting[]
		handleColumnActiveChange: (
			colSetting: ColumnSetting,
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
				{columnRenderStruct.map((setting) => (
					<div
						key={setting.keyof}
						className={clsx(
							"flex items-center p-3 rounded-md",
							"transition-colors duration-200",
							setting.checked
								? "bg-indigo-50 border border-indigo-200"
								: "bg-white border border-gray-200",
							"hover:bg-indigo-100/50",
						)}
					>
						<Checkbox
							{...setting}
							onChange={(value) => handleColumnActiveChange(setting, value)}
							className={clsx("text-indigo-600 focus:ring-indigo-500")}
						/>
					</div>
				))}
			</div>
		)
	},
)

YearTableSettingsList.displayName = "YearTableSettingsList"
