import * as fcl from '@onflow/fcl';

// CONFIGURATION
// Setting Configuration Values
// Ref: https://docs.onflow.org/fcl/reference/api/#setting-configuration-values
fcl.config({
    'accessNode.api': 'https://access-testnet.onflow.org',
    'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
});
// OR
fcl.config().put('foo', 'bar').put('accessNode.api', 'https://access-testnet.onflow.org');

// Getting Configuration Values
// Ref: https://docs.onflow.org/fcl/reference/api/#getting-configuration-values
const FALLBACK = 1;
fcl.config()
    .get('woot', FALLBACK)
    .then(d => console.log(d));

// Address replacement in scripts and transactions
// Ref: https://docs.onflow.org/fcl/reference/api/#address-replacement-in-scripts-and-transactions
fcl.config().put('0xFlowToken', '0x7e60df042a9c0868');

// https://docs.onflow.org/fcl/reference/configure-fcl/#example
fcl.config()
  .put("flow.network", "testnet")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "http://localhost:3000/fcl/authn")
  .put("app.detail.title", "Test Harness")
  .put("app.detail.icon", "https://i.imgur.com/r23Zhvu.png")
  .put("service.OpenID.scopes", "email email_verified name zoneinfo")
  .put("fcl.limit", 100)
  .put("0xFlowToken", "0x7e60df042a9c0868")
