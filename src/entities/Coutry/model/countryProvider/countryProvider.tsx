import { useMemo, type ReactNode } from "react"
import { CountryContext } from "./countryContext"
import { useResource } from "../useResource"
import type { CountriesNormalized } from "../types"
import { normalizeCountries } from "../model"

export const CountryProvider = ({ children }: { children: ReactNode }) => {
	const countriesCache = useResource({ src: "/owid-co2-data.json" })

	const cacheNormalized: CountriesNormalized = useMemo(() => {
		return normalizeCountries(countriesCache)
	}, [countriesCache])

	return (
		<CountryContext.Provider value={cacheNormalized}>
			{children}
		</CountryContext.Provider>
	)
}
