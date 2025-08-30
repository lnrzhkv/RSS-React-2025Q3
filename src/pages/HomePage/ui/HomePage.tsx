import { useCountries } from "../../../entities/Coutry"
import { Heading } from "../../../shared/ui/Heading"
import { Subheading } from "../../../shared/ui/Subheading"
import { YearSelector } from "../../../features/YearSelector"
import {
	CountrySearch,
	useCountrySearch,
} from "../../../features/CountrySearch"
import { useYearSelector } from "../../../features/YearSelector"
import { CountryTable, useCountryTable } from "../../../features/CoutryTable"
import { useCallback, useMemo, useState } from "react"
import clsx from "clsx"
import type { TableData } from "../../../shared/ui/Table"
import { useYearTableSettings } from "../../../features/YearTableSettings"
import { YearTableSettings } from "../../../features/YearTableSettings"
import { Text } from "../../../shared/ui/Text"
import { CountryDetails } from "../../../features/CountryDetails"

const HomePage = () => {
	const countries = useCountries()
	const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

	const {
		columnRenderStruct,
		activeKeys,
		activeLabels,
		handleColumnActiveChange,
	} = useYearTableSettings()

	const { selectedYear, setSelectedYear, yearsOptions } =
		useYearSelector(countries)

	const { handleClickSearch, searchValue } = useCountrySearch()

	const tableBodyData = useCountryTable({
		countries,
		searchValue,
		selectedYear,
	})

	const yearTableData: TableData = useMemo(() => {
		if (!selectedCountry || !countries[selectedCountry]) {
			return { head: [], body: [] }
		}

		const selectedCountryData = countries[selectedCountry]
		return {
			head: activeLabels,
			body: Object?.values(selectedCountryData.data ?? {})
				?.sort((a, b) => b.year - a.year)
				?.map((yearData) =>
					activeKeys?.map(
						(key) => yearData?.[key as keyof typeof yearData] ?? "N/A",
					),
				),
		}
	}, [activeKeys, activeLabels, countries, selectedCountry])

	const handleRowClick = useCallback((row: (string | number)[]) => {
		setSelectedCountry(row[0] as string)
	}, [])

	const handleCloseModal = useCallback(() => {
		setSelectedCountry(null)
	}, [])

	return (
		<div className={clsx("p-8", "min-h-screen")}>
			<Heading>CO₂ and Greenhouse Gas Emissions</Heading>
			<Subheading>
				Explore Data on CO2 and Greenhouse Gas Emissions in our world
			</Subheading>
			<div className="max-w-2xl mx-auto mt-4">
				<Text>
					This data has been collected, aggregated, and documented by Hannah
					Ritchie, Max Roser, Edouard Mathieu, Bobbie Macdonald and Pablo
					Rosado. The mission of Our World in Data is to make data and research
					on the world's largest problems understandable and accessible.
				</Text>
			</div>

			<div
				className={clsx(
					"mt-8 p-5 pt-6 flex flex-col rounded-xl",
					"border border-solid border-indigo-300 bg-indigo-100/70",
					"shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
				)}
			>
				<div className="flex gap-4 mb-4 justify-between flex-col sm:flex-row">
					<CountrySearch
						searchValue={searchValue}
						onClickSearch={handleClickSearch}
					/>

					<div className="flex gap-4 self-end">
						<YearSelector
							yearsOptions={yearsOptions}
							value={selectedYear}
							onChange={setSelectedYear}
						/>
						<YearTableSettings
							columnRenderStruct={columnRenderStruct}
							handleColumnActiveChange={handleColumnActiveChange}
						/>
					</div>
				</div>

				<CountryTable
					tableBodyData={tableBodyData}
					populationYear={selectedYear}
					handleRowClick={handleRowClick}
				/>
			</div>

			<CountryDetails
				selectedCountry={selectedCountry}
				yearTableData={yearTableData}
				onCloseModal={handleCloseModal}
			/>
		</div>
	)
}

export default HomePage
