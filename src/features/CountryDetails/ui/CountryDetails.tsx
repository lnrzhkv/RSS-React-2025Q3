import { memo, useEffect, useState } from "react"
import { Modal } from "../../../shared/ui/Modal"
import YearTable from "./YearTable"
import type { TableData } from "../../../shared/ui/Table"

const CountryDetails = memo(
	({
		selectedCountry,
		yearTableData,
		onCloseModal,
	}: {
		selectedCountry: string | null
		yearTableData: TableData
		onCloseModal?: () => void
	}) => {
		const [isModalOpen, setIsModalOpen] = useState(!!selectedCountry)

		useEffect(() => {
			setIsModalOpen(!!selectedCountry)
		}, [selectedCountry])

		const handleCloseModal = () => {
			onCloseModal?.()
			setIsModalOpen(false)
		}

		return (
			<>
				<Modal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					title={
						selectedCountry
							? `Emissions data for ${selectedCountry}`
							: "Information"
					}
				>
					{selectedCountry && <YearTable tableData={yearTableData} />}
				</Modal>
			</>
		)
	},
)

CountryDetails.displayName = "CountryDetails"
export default CountryDetails
