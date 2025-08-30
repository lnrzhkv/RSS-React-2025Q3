import { useMemo, useState } from "react"
import type { CountriesNormalized } from "../../../entities/Coutry"

export const useYearSelector = (countries: CountriesNormalized) => {
	const yearsOptions = useMemo(() => {
		const yearsSet = new Set<number>()

		Object.values(countries).forEach((country) => {
			Object.values(country.data).forEach((yearObj) => {
				if (typeof yearObj.year === "number") {
					yearsSet.add(yearObj.year)
				}
			})
		})

		return Array.from(yearsSet)
			.sort((a, b) => b - a)
			.map((year) => ({
				value: year,
				label: year.toString(),
			}))
	}, [countries])

	const latestYear = useMemo(() => {
		let maxYear: number | undefined = undefined

		Object.values(countries).forEach((country) => {
			Object.values(country.data).forEach((yearObj) => {
				if (typeof yearObj.year === "number") {
					if (maxYear === undefined || yearObj.year > maxYear) {
						maxYear = yearObj.year
					}
				}
			})
		})

		return maxYear
	}, [countries])

	const [selectedYear, setSelectedYear] = useState<number>(latestYear ?? 2023)

	return {
		yearsOptions,
		selectedYear,
		setSelectedYear,
	}
}
