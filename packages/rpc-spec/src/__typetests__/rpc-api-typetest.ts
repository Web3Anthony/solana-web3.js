import { createRpcApi, RpcApi, RpcApiMethods } from '../rpc-api';

type NftCollectionDetailsApiResponse = Readonly<{
    address: string;
    circulatingSupply: number;
    description: string;
    erc721: boolean;
    erc1155: boolean;
    genesisBlock: string;
    genesisTransaction: string;
    name: string;
    totalSupply: number;
}>;

interface NftCollectionDetailsApi extends RpcApiMethods {
    qn_fetchNFTCollectionDetails(args: { contracts: string[] }): NftCollectionDetailsApiResponse;
}

type QuickNodeRpcMethods = NftCollectionDetailsApi;

createRpcApi<QuickNodeRpcMethods>() satisfies RpcApi<QuickNodeRpcMethods>;
