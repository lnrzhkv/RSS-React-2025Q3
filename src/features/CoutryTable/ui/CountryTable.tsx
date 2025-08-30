import { memo } from "react"
import { Table } from "../../../shared/ui/Table"
import type { TableData } from "../../../shared/ui/Table/types"

const CountryTable = memo(
	({
		handleRowClick,
		populationYear,
		tableBodyData,
	}: {
		handleRowClick?: (row: (string | number)[], idx: number) => void
		populationYear?: number
		tableBodyData: (string | number)[][]
	}) => {
		const populationColumn = populationYear
			? `Population (${populationYear})`
			: "Population"
		const tableData: TableData = {
			head: ["Country name", "ISO", populationColumn],
			sortingKeys: ["Country name", populationColumn],
			body: tableBodyData || [
				["Country A", "CTA", 123456],
				["Country B", "CTB", 654321],
				["Country C", "CTC", 987654],
			],
		}

		return (
			<Table
				withIndication
				indicatedColumnIndex={[2]}
				data={tableData}
				onRowClick={handleRowClick}
			/>
		)
	},
)

CountryTable.displayName = "CountryTable"

export default CountryTable
