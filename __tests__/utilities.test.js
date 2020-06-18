import {
    tee,
    compose,
    deepFreeze,
    deepCopy
} from '../src/scripts/utilities';

describe('#tee', () => {
    test('Check _ returns data and function executes, together with compose', () => {
        let haveBeenHere = false;
        const add1 = x => x + 1;
        const add2 = x => x + 2;
        const empty = () => {
            // side effect
            haveBeenHere = true;
        };
        expect(compose(add1, tee(empty), add2)(0)).toEqual(3);
        expect(haveBeenHere).toEqual(true);
    });
});

describe('#deepFreeze', () => {
    test('Check if mutation is impossible with deepFreeze', () => {
        const fakeApp = {
            state: {
                b: 3
            },
            constants: {}
        };
        // Valid JS
        const fakeApp2 = { ...fakeApp };
        fakeApp.state.b = 5;
        expect(fakeApp2.state.b).toEqual(5);

        // Frozen Object. Should throw Error
        const fakeApp3 = deepFreeze(fakeApp);
        const attemptNewState = {
            state: {
                b: 3
            },
            constants: {}
        };
        expect(() => Object.assign(fakeApp3, attemptNewState)).toThrow(
            `Cannot assign to read only property 'state' of object '#<Object>'`
        );
    });
});

describe('#deepCopy', () => {
    test('Deep copies object', () => {
        const fakeApp = {
            state: {
                b: 3
            },
            constants: {}
        };
        const copyOfFakeApp = deepCopy(fakeApp);
        expect(fakeApp).toStrictEqual(copyOfFakeApp);
    });
});
