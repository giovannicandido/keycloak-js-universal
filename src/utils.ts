export function validateAndParseFlow(flow: string): string {
    if (flow === null || flow === undefined) {
        flow = 'standard'
    }

    switch (flow) {
        case 'standard':
        case 'implicit':
        case 'hybrid':
            return flow
        default:
            throw 'Invalid value for flow'
    }
}

export function flowToResponseType(flow: string): string {
    flow =  validateAndParseFlow(flow)
    switch (flow) {
        case 'standard':
            return 'code'
        case 'implicit':
            return 'id_token token'
        case 'hybrid':
            return 'code id_token token'
    }
}

export function validateAndParseMode(responseMode: string): string {

    if (responseMode === null || responseMode === undefined) {
        responseMode = 'fragment'
    }

    switch (responseMode) {
        case 'query':
            return 'query'
        case 'fragment':
            return 'fragment'
        default:
            throw new Error('Invalid response mode')
    }
}
