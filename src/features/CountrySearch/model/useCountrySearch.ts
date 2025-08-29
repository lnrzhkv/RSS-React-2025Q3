import { useCallback, useState, useTransition } from "react"

const capitalizeFirstLetter = (str: string) => {
	if (str.length === 0) return str
	return str.charAt(0).toUpperCase() + str.slice(1)
}
export const useCountrySearch = () => {
	const [searchValue, setSearchValue] = useState("")
	const [_, startTransition] = useTransition()

	const handleClickSearch = useCallback((value: string) => {
		startTransition(() => setSearchValue(capitalizeFirstLetter(value)))
		if (_) return
	}, [])

	return {
		searchValue,
		handleClickSearch,
	}
}
