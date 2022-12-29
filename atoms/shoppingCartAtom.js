const {atom,selector} = require('recoil');
const { recoilPersist } = require('recoil-persist');

const { persistAtom } = recoilPersist()
const cart = atom({
    key: 'cartState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
    effects_UNSTABLE: [persistAtom]
});

const cartLength = selector({
    key:'cartLength',
    get:({get}) => {
        const cartState = get(cart);
        return cartState.length;
    }
})

export {cart,cartLength}