import { memo } from "react"
import { Table, type TableData } from "../../../shared/ui/Table"

const YearTable = memo(({ tableData }: { tableData: TableData }) => {
	return (
		<div className="w-full overflow-y-hidden">
			<Table data={tableData} className="h-[400px] sm:rounded-none" />
		</div>
	)
})

YearTable.displayName = "YearTable"

export default YearTable
