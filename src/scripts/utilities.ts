export const tee = (fn: (...arg: any[]) => void) => <T>(data: T): T => {
    fn(data);
    return data;
};

export function compose(...fns: Function[]) {
    return <T>(initial: T): T => fns.reduceRight((a, b) => b(a), initial);
}

export function deepFreeze<T, K extends keyof T>(obj: T) {
    for (const key of Object.keys(obj)) {
        if (
            Array.isArray(obj[key as K]) ||
            typeof obj[key as K] === 'object'
        ) {
            Object.freeze(obj);
            deepFreeze(obj[key as K]);
        }
    }
    return Object.freeze(obj);
}

export function deepCopy(obj: Object) {
    return JSON.parse(JSON.stringify(obj));
}
