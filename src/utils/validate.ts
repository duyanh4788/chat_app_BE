

export const validateValue = (value: any): boolean => {
    if (!value || value && value === '') return false
    return true
}