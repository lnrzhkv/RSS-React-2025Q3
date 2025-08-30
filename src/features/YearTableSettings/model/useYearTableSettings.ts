import { useCallback, useMemo, useState } from "react"
import { tableConstructor } from "./constructor"
import type { ColumnSetting } from "./types"

export const useYearTableSettings = () => {
	const [activeColumnsState, setActiveColumnsState] = useState(() =>
		structuredClone(tableConstructor),
	)

	const handleColumnActiveChange = useCallback(
		(colSetting: ColumnSetting, value: boolean) => {
			setActiveColumnsState((prevColumnSettings) => ({
				...prevColumnSettings,
				[colSetting.keyof]: {
					...prevColumnSettings[
						colSetting.keyof as keyof typeof prevColumnSettings
					],
					active: value,
				},
			}))
		},
		[],
	)

	const columnRenderStruct = useMemo(() => {
		return Object.values(activeColumnsState).map((obj) => {
			return {
				keyof: obj.keyof,
				label: obj.label,
				checked: obj.active,
				disabled: obj.readonly,
			}
		})
	}, [activeColumnsState])

	const activeColumnsData = useMemo(() => {
		const activeColumns = Object.values(activeColumnsState)
			.filter((col) => col.active)
			.map((col) => ({ keyof: col.keyof, label: col.label }))

		return {
			activeColumns,
			activeKeys: activeColumns.map((col) => col.keyof),
			activeLabels: activeColumns.map((col) => col.label),
		}
	}, [activeColumnsState])

	return {
		columnRenderStruct,
		activeKeys: activeColumnsData.activeKeys,
		activeLabels: activeColumnsData.activeLabels,
		handleColumnActiveChange,
	}
}
