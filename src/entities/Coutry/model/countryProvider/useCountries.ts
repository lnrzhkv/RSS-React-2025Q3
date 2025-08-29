import { use } from "react"
import { CountryContext } from "./countryContext"

export const useCountries = () => {
	const context = use(CountryContext)
	if (!context) {
		throw new Error("useCountryContext must be used within a CountryProvider")
	}
	return context
}
