class apiResponse {
    constructor (statusCode, message, data = "success") {
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success =statusCode >= 400 && statusCode < 300 ? true : false
    }
}

export {apiResponse};
