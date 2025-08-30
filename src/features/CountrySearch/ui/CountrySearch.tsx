import { useState, memo } from "react"
import { Button } from "../../../shared/ui/Button"
import { Input } from "../../../shared/ui/Input"
import { SearchIcon } from "../../../shared/ui/SearchIcon"

const CountrySearch = memo(
	({
		searchValue,
		onClickSearch,
	}: {
		searchValue: string
		onClickSearch: (value: string) => void
	}) => {
		const [value, setValue] = useState(searchValue)

		const handleChangeInput = (value: string) => {
			setValue(value)
		}

		const handleClickSearch = () => {
			onClickSearch(value)
		}

		const handleKeyDown = (event: React.KeyboardEvent) => {
			if (event.key === "Enter") {
				handleClickSearch()
			}
		}

		const handleClear = () => {
			setValue("")
			onClickSearch("")
		}

		return (
			<div className="flex items-center gap-4">
				<Input
					placeholder="Search for a country..."
					value={value}
					onChange={handleChangeInput}
					onKeyDown={handleKeyDown}
					onClear={handleClear}
				/>
				<Button
					size="default"
					onClick={handleClickSearch}
					icon={<SearchIcon />}
				>
					Search
				</Button>
			</div>
		)
	},
)

CountrySearch.displayName = "CountrySearch"

export default CountrySearch
