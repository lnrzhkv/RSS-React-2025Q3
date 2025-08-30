import { createContext } from "react"
import type { CountriesNormalized } from "../types"

export const CountryContext = createContext<CountriesNormalized | null>(null)
