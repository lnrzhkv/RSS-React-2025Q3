export type TableData = {
	head: string[]
	sortingKeys?: string[]
	body: (string | number)[][]
}

export type SortOrder = "asc" | "desc"

export type TableProps = {
	data: TableData
	onRowClick?: (row: (string | number)[], idx: number) => void
	className?: string
	withIndication?: boolean
	indicatedColumnIndex?: number[]
}

export type TableHeadProps = {
	head: string[]
	sortingKeys?: string[]
	sortBy: string | null
	order: SortOrder
	onSort: (key: string) => void
}

export type TableBodyProps = {
	head: string[]
	body: (string | number)[][]
	onRowClick?: (row: (string | number)[], idx: number) => void
	withIndication?: boolean
	indicatedColumnIndex?: number[]
}
