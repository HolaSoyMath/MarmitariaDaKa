export class NotFoundError extends Error {
  status = 404
  constructor(message = 'Not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  status = 409
  constructor(message = 'Conflict') {
    super(message)
    this.name = 'ConflictError'
  }
}
