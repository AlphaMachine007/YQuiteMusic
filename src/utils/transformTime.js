const transformTimeToString = (t) => {
    const minutes = Math.floor(t / 1000 / 60);
    const seconds = Math.floor(t % 60000 / 1000);
    let zeroM = '', zeroS = '';
    if (minutes < 10) {
        zeroM = '0'
    }
    if (seconds < 10) {
        zeroS = '0'
    }
    return zeroM + minutes + ':' + zeroS + seconds;
}

export default transformTimeToString;