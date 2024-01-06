
export function* batched(arr, n = 1) {
    const l = arr.length;
    for (let ndx = 0; ndx < l; ndx += n) {
        const actual_end = Math.min(ndx + n, l);
        yield arr.slice(ndx, actual_end)
    }
};

export const current_time = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()},${d.getMilliseconds()}`;
};

export const logJS = (msg) => console.log(`JS: ${current_time()} ${msg}`);
