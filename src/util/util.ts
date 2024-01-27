export const rng = (lo: number, hi: number) => 
    Math.floor(Math.random() * (hi - lo + 1)) + lo;

export const shuffle = (arr: any[]) => {
    const shuffledArr = [];

    while (arr.length != 0) {
        const el = arr.splice(rng(0, arr.length - 1), 1);
        shuffledArr.push(el[0]);
    }

    return shuffledArr;
}