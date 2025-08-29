import { createContext } from "react"
import type { CountriesNormalized } from "../types"

export const CountryContext = createContext<{
	countries: CountriesNormalized
	setCountries: (countries: CountriesNormalized) => void
} | null>(null)
