import type { Address } from '@solana/addresses';
import type { Rpc } from '@solana/rpc-spec';
import { RpcError } from '@solana/rpc-spec-types';
import type { Commitment, SolanaRpcErrorCode } from '@solana/rpc-types';
import fetchMock from 'jest-fetch-mock-fork';

import { GetTokenSupplyApi } from '../index';
import { createLocalhostSolanaRpc } from './__setup__';

const CONTEXT_MATCHER = expect.objectContaining({
    slot: expect.any(BigInt),
});

describe('getTokenSupply', () => {
    let rpc: Rpc<GetTokenSupplyApi>;
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.dontMock();
        rpc = createLocalhostSolanaRpc();
    });

    (['confirmed', 'finalized', 'processed'] as Commitment[]).forEach(commitment => {
        describe(`when called with \`${commitment}\` commitment`, () => {
            it('returns total token supply', async () => {
                expect.assertions(1);
                // See scripts/fixtures/spl-token-mint-account.json
                const pubkey =
                    'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr' as Address<'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'>;
                const tokenAccountBalancePromise = rpc.getTokenSupply(pubkey, { commitment }).send();
                await expect(tokenAccountBalancePromise).resolves.toStrictEqual({
                    context: CONTEXT_MATCHER,
                    value: {
                        amount: '1690580887590527729',
                        decimals: 6,
                        // This can be Number or null, but we're using a fixture so it should be Number
                        uiAmount: 1690580887590.5278,
                        uiAmountString: '1690580887590.527729',
                    },
                });
            });
        });
    });

    describe('when called with an account that is not a token mint', () => {
        it('throws an error', async () => {
            expect.assertions(2);
            const sendPromise = rpc
                .getTokenSupply(
                    // Randomly generated
                    'BnWCFuxmi6uH3ceVx4R8qcbWBMPVVYVVFWtAiiTA1PAu' as Address,
                )
                .send();
            await expect(sendPromise).rejects.toThrow(RpcError);
            await expect(sendPromise).rejects.toMatchObject({
                code: -32602 satisfies (typeof SolanaRpcErrorCode)['JSON_RPC_INVALID_PARAMS'],
            });
        });
    });
});
