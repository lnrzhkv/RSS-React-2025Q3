import { useCallback, useMemo, useState } from "react"
import { tableConstructor } from "./constructor"

export const useYearTableSettings = () => {
	const [activeColumnsState, setActiveColumnsState] = useState(() =>
		structuredClone(tableConstructor),
	)

	const handleColumnActiveChange = useCallback(
		(
			colSetting: {
				keyof: string
				label: string
				checked: boolean
				disabled: boolean
			},
			value: boolean,
		) => {
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

	const activeColumns = useMemo(() => {
		return Object.values(activeColumnsState)
			.filter((col) => col.active)
			.map((col) => ({ keyof: col.keyof, label: col.label }))
	}, [activeColumnsState])

	const activeKeys = useMemo(() => {
		return activeColumns.map((col) => col.keyof)
	}, [activeColumns])

	const activeLabels = useMemo(() => {
		return activeColumns.map((col) => col.label)
	}, [activeColumns])

	return {
		columnRenderStruct,
		activeKeys,
		activeLabels,
		handleColumnActiveChange,
	}
}
