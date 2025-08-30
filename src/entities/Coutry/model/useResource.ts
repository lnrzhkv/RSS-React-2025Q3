import { createResource } from "../../../shared/lib/createResource"
import { JsonDB } from "../../../shared/lib/jsonDB"
import type { CountryDto } from "./types"

const db = new JsonDB<CountryDto>("app-db", "countries")

let resource: ReturnType<typeof createResource<CountryDto>>

async function loadCountries({ src }: { src: string }): Promise<CountryDto> {
	const cached = await db.get("all")
	if (cached) {
		return cached
	}

	console.log("Fetching from network 🌍")
	const res = await fetch(src)
	const json = (await res.json()) as CountryDto

	await db.set("all", json)

	return json
}

export function useResource({ src }: { src: string }) {
	if (!resource) {
		resource = createResource(loadCountries({ src }))
	}
	return resource.read()
}
