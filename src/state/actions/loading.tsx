export function startLoading() {
    return {
        type: 'loading/started'
    }
}

export function endedLoading() {
    return {
        type: 'loading/ended'
    }
}