const {atom,selector} = require('recoil');

const licenses = atom({
    key: 'firestore-licenses',
    default: []
});

export {licenses}