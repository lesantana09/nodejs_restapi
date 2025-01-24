type RecordType = Record<string, unknown>

class InMemoryDatabase<T extends RecordType> {
  private data: Map<string, T>

  constructor() {
    this.data = new Map<string, T>()
  }

  create(id: string, record: T) {
    if (this.data.has(id)) {
      throw new Error(`Record with ID "${id}" already exists.`)
    }
    this.data.set(id, record)
  }

  read(id: string) {
    return this.data.get(id)
  }

  list() {
    return Array.from(this.data.values())
  }
}

export default InMemoryDatabase
