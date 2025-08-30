import { useMemo } from "react"
import type { CountriesNormalized } from "../../../entities/Coutry"

export const useCountryTable = ({
	countries,
	searchValue,
	selectedYear,
}: {
	countries: CountriesNormalized
	searchValue: string
	selectedYear: number
}) => {
	return useMemo(() => {
		const searchedCountry: CountriesNormalized[0] | undefined =
			countries[searchValue]

		if (searchedCountry !== undefined && selectedYear !== undefined) {
			const iso = searchedCountry.iso ?? "N/A"
			const countryName = searchValue
			const yearData = searchedCountry.data[selectedYear]
			const population = yearData?.population ?? "N/A"

			return [[countryName, iso, population]]
		} else {
			const preparedList = Object.entries(countries).map(
				([countryName, countryData]) => {
					const iso = countryData.iso ?? "N/A"
					const yearData = countryData.data[selectedYear]
					const population = yearData?.population ?? "N/A"
					return [countryName, iso, population]
				},
			)
			return preparedList
		}
	}, [countries, searchValue, selectedYear])
}
