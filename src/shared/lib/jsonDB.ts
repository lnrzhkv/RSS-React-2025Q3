export class JsonDB<T = unknown> {
	private dbName: string
	private storeName: string
	private version: number

	constructor(dbName = "app-db", storeName = "json-store", version = 1) {
		this.dbName = dbName
		this.storeName = storeName
		this.version = version
	}

	private openDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.version)

			request.onupgradeneeded = () => {
				const db = request.result
				if (!db.objectStoreNames.contains(this.storeName)) {
					db.createObjectStore(this.storeName)
				}
			}

			request.onsuccess = () => resolve(request.result)
			request.onerror = () => reject(request.error)
		})
	}

	async set(key: string, value: T): Promise<void> {
		const db = await this.openDB()
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, "readwrite")
			tx.objectStore(this.storeName).put(value, key)
			tx.oncomplete = () => resolve()
			tx.onerror = () => reject(tx.error)
		})
	}

	async get(key: string): Promise<T | null> {
		const db = await this.openDB()
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, "readonly")
			const req = tx.objectStore(this.storeName).get(key)
			req.onsuccess = () => resolve(req.result ?? null)
			req.onerror = () => reject(req.error)
		})
	}

	async delete(key: string): Promise<void> {
		const db = await this.openDB()
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, "readwrite")
			tx.objectStore(this.storeName).delete(key)
			tx.oncomplete = () => resolve()
			tx.onerror = () => reject(tx.error)
		})
	}

	async clear(): Promise<void> {
		const db = await this.openDB()
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, "readwrite")
			tx.objectStore(this.storeName).clear()
			tx.oncomplete = () => resolve()
			tx.onerror = () => reject(tx.error)
		})
	}
}
