import { useState } from "react"
import { Button } from "../../../shared/ui/Button"
import { SettingsIcon } from "../../../shared/ui/SettingsIcon"
import { Modal } from "../../../shared/ui/Modal"
import { YearTableSettingsList } from "./YearTableSettingsList"

const YearTableSettings = ({
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

export default YearTableSettings
