import { Dropdown, type DropdownOption } from "../../../shared/ui/Dropdown"

const YearSelector = ({
	yearsOptions,
	value,
	onChange,
}: {
	yearsOptions: DropdownOption<number>[]
	value?: number
	onChange: (value: number) => void
}) => {
	return (
		<Dropdown
			options={yearsOptions}
			value={value}
			onChange={(value) => onChange(+value)}
		/>
	)
}

YearSelector.displayName = "YearSelector"

export default YearSelector
