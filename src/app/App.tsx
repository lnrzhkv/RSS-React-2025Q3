import { HomePage } from "@pages/HomePage"
import { Suspense } from "react"
import { CountryProvider } from "../entities/Coutry"
import { Loader } from "../shared/ui/Loader"

function App() {
	return (
		<>
			<Suspense fallback={<Loader isCentered />}>
				<CountryProvider>
					<HomePage />
				</CountryProvider>
			</Suspense>
		</>
	)
}

export default App
