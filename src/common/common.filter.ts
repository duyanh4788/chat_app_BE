export const filterPaging = (pages: number) => {
    const limit = 10;
    const skip = pages ? (pages - 1) * limit : 10;
    return { limit, skip }
}