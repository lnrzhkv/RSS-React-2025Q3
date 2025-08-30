type Resource<T> = {
	read: () => T
}

export function createResource<T>(promise: Promise<T>): Resource<T> {
	let status = "pending"
	let result: T

	const suspender = promise.then(
		(res) => {
			status = "success"
			result = res
		},
		(err) => {
			status = "error"
			result = err
		},
	)

	return {
		read(): T {
			if (status === "pending") throw suspender
			if (status === "error") throw result
			return result!
		},
	}
}
