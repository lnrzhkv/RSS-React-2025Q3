export type YearDto = {
	cement_co2: number
	cement_co2_per_capita: number
	co2: number
	co2_growth_abs: number
	co2_growth_prct: number
	co2_including_luc: number
	co2_including_luc_growth_abs: number
	co2_including_luc_growth_prct: number
	co2_including_luc_per_capita: number
	co2_per_capita: number
	coal_co2: number
	coal_co2_per_capita: number
	cumulative_cement_co2: number
	cumulative_co2: number
	cumulative_co2_including_luc: number
	cumulative_coal_co2: number
	cumulative_flaring_co2: number
	cumulative_gas_co2: number
	cumulative_luc_co2: number
	cumulative_oil_co2: number
	flaring_co2: number
	flaring_co2_per_capita: number
	gas_co2: number
	gas_co2_per_capita: number
	ghg_excluding_lucf_per_capita: number
	ghg_per_capita: number
	land_use_change_co2: number
	land_use_change_co2_per_capita: number
	methane: number
	methane_per_capita: number
	nitrous_oxide: number
	nitrous_oxide_per_capita: number
	oil_co2: number
	oil_co2_per_capita: number
	population: number
	share_global_cement_co2: number
	share_global_co2: number
	share_global_co2_including_luc: number
	share_global_coal_co2: number
	share_global_cumulative_cement_co2: number
	share_global_cumulative_co2: number
	share_global_cumulative_co2_including_luc: number
	share_global_cumulative_coal_co2: number
	share_global_cumulative_flaring_co2: number
	share_global_cumulative_gas_co2: number
	share_global_cumulative_luc_co2: number
	share_global_cumulative_oil_co2: number
	share_global_flaring_co2: number
	share_global_gas_co2: number
	share_global_luc_co2: number
	share_global_oil_co2: number
	share_of_temperature_change_from_ghg: number
	temperature_change_from_ch4: number
	temperature_change_from_co2: number
	temperature_change_from_ghg: number
	temperature_change_from_n2o: number
	total_ghg: number
	total_ghg_excluding_lucf: number
	year: number
}

export type CountryDto = {
	[countryName: string]: {
		iso_code?: string
		data: Partial<YearDto> & { year: number }[]
	}
}

export type YearsNormalized = {
	[key: string]: Partial<YearDto> & { year: number }
}

export type CountriesNormalized = {
	[countryName: string]: {
		iso?: string
		data: YearsNormalized
	}
}
