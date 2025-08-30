import { useState } from "react"
import { Button } from "../../../shared/ui/Button"
import { SettingsIcon } from "../../../shared/ui/SettingsIcon"
import { Modal } from "../../../shared/ui/Modal"
import { YearTableSettingsList } from "./YearTableSettingsList"
import type { ColumnSetting } from "../model/types"

const YearTableSettings = ({
	columnRenderStruct,
	handleColumnActiveChange,
}: {
	columnRenderStruct: ColumnSetting[]
	handleColumnActiveChange: (colSetting: ColumnSetting, value: boolean) => void
}) => {
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
	return (
		<>
			<Button
				onClick={() => setIsSettingsModalOpen(true)}
				className="mb-4 bg-indigo-400 hover:bg-indigo-500 text-white hover:text-white"
				icon={<SettingsIcon />}
			>
				Settings
			</Button>

			<Modal
				isOpen={isSettingsModalOpen}
				onClose={() => setIsSettingsModalOpen(false)}
				title="Configure table columns and data with additional settings"
			>
				<div className="flex flex-col gap-4">
					<YearTableSettingsList
						columnRenderStruct={columnRenderStruct}
						handleColumnActiveChange={handleColumnActiveChange}
					/>
					<div className="flex justify-end">
						<Button onClick={() => setIsSettingsModalOpen(false)}>Save</Button>
					</div>
				</div>
			</Modal>
		</>
	)
}

YearTableSettings.displayName = "YearTableSettings"

export default YearTableSettings
