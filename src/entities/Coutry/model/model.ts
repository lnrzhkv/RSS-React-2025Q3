import type { CountriesNormalized, CountryDto, YearsNormalized } from "./types"

export const normalizeCountries = (
	countriesCache: CountryDto,
): CountriesNormalized => {
	return Object.entries(countriesCache).reduce(
		(acc, [countryName, country]) => {
			acc[countryName] = {
				iso: country.iso_code,
				data: country.data.reduce((dataAcc, yearData) => {
					dataAcc[yearData.year] = yearData
					return dataAcc
				}, {} as YearsNormalized),
			}
			return acc
		},
		{} as CountriesNormalized,
	)
}
