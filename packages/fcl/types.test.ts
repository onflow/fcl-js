import * as fcl from '@onflow/fcl';

fcl.authenticate();
fcl.authenticate({
    service: {
        f_type: 'Service',
        f_vsn: '1.0.0',
        type: 'authn',
        method: 'IFRAME/RPC',
        uid: 'blocto#authn',
        endpoint: 'https://flow-wallet.blocto.app/authn',
        provider: {
            address: '0x55ad22f01ef568a1',
            name: 'Blocto',
            icon: '/images/blocto.png',
            description: 'Your Entrance To The Blockchain World.',
            color: '#afd8f7',
            supportEmail: 'support@blocto.app',
            website: 'https://blocto.portto.io',
        },
    },
});

fcl.unauthenticate();

fcl.reauthenticate();

fcl.signUp();
fcl.logIn();

console.log(fcl.authz);

fcl.currentUser.subscribe(console.log);
const user = fcl.currentUser.snapshot();
if (user.loggedIn) {
  console.log(user.addr);
} else {
  fcl.logIn();
}

export const signMessage = async () => {
    const MSG = '464f4f'; // 'FOO' to hex
    try {
        return await fcl.currentUser.signUserMessage(MSG);
    } catch (error) {
        console.log(error);
    }
};

fcl.discovery.authn.subscribe(res => console.log(res.results));
fcl.discovery.authn.snapshot().then(res => console.log(res));
