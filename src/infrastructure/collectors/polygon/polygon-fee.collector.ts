import { JsonRpcProvider } from 'ethers/providers';
import { BaseFeeCollector, type IFeeCollector } from '../base-fee.collector';
import polygonScanABI from './abi.json';

const CONTRACT_ADDRESS = '0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9';
const POLYGON_RPC = 'https://polygon-rpc.com';

export class PolygonFeeCollector
	extends BaseFeeCollector
	implements IFeeCollector
{
	constructor() {
		super(CONTRACT_ADDRESS, polygonScanABI, new JsonRpcProvider(POLYGON_RPC));
	}
}
