

class ApiErorHandling extends Error {
    constructor(statusCode, message = "somthing went wrong", errors = [], statck = "") {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors
    }
}
export { ApiErorHandling}