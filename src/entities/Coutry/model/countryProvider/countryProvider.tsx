import { useEffect, useMemo, useState, type ReactNode } from "react"
import { CountryContext } from "./countryContext"
import { useResource } from "../useResource"
import type { CountriesNormalized } from "../types"
import { normalizeCountries } from "../model"

export const CountryProvider = ({ children }: { children: ReactNode }) => {
	const countriesCache = useResource({ src: "/owid-co2-data.json" })

	const cacheNormalized: CountriesNormalized = useMemo(() => {
		return normalizeCountries(countriesCache)
	}, [countriesCache])

	const [countries, setCountries] = useState<CountriesNormalized>({})

	useEffect(() => {
		if (
			Object?.keys(countries)?.length === 0 &&
			Object?.keys(cacheNormalized)?.length > 0
		) {
			setCountries(cacheNormalized)
		}
	}, [cacheNormalized, countries])

	const memoValue = useMemo(
		() => ({
			countries: countries,
			setCountries,
		}),
		[countries],
	)

	return (
		<CountryContext.Provider value={memoValue}>
			{children}
		</CountryContext.Provider>
	)
}
