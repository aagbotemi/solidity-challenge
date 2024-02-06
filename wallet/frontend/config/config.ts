import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
})

let ethereum;

if (typeof window !== 'undefined') {
    ({ ethereum } = window);
}
// Declare the type for walletClient
export const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(ethereum),
}) // You can set a default value or handle this case accordingly

// export { walletClient };


// JSON-RPC Account
// export const [account] = await walletClient?.getAddresses()
export const [account] = (await walletClient?.getAddresses()) || [];
// Local Account
// export const account = privateKeyToAccount('0x...')