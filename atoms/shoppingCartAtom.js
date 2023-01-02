const {atom,selector} = require('recoil');
const { recoilPersist } = require('recoil-persist');

const { persistAtom } = recoilPersist()
const cart = atom({
    key: 'cartState',
    default: [],
    effects_UNSTABLE: [persistAtom]
});

const cartDetail = atom({
    key: 'cartDetailState',
    default: [],
    effects_UNSTABLE: [persistAtom]
});

const cartDetailSubTotal = selector({
    key:'cartDetailSubTotal',
    get:({get}) => {
        const cartDetailState = get(cartDetail);
        const subTotal = cartDetailState.reduce((total, item) => total + (item.Items[0].UnitPrice * item.Items[0].Quantity), 0)
        return subTotal
    }
})
const cartDetailDiscountTotal = selector({
    key:'cartDetailDiscountTotal',
    get:({get}) => {
        const cartDetailState = get(cartDetail);
        const discountTotal = cartDetailState.reduce((total, item) => total + (((item.Items[0].UnitPrice * item.Items[0].Quantity) * item.Items[0].Discount)) /100, 0)
        return discountTotal
    }
})
const cartLength = selector({
    key:'cartLength',
    get:({get}) => {
        const cartState = get(cart);
        return cartState.length;
    }
})

export {cart,cartLength,cartDetail,cartDetailSubTotal,cartDetailDiscountTotal}