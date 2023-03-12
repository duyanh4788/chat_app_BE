export const checkTimerAuthenticator = (time: Date): boolean => {
    const isCheked = new Date(time).getTime() < new Date().getTime() - 3600000;
    return isCheked
}