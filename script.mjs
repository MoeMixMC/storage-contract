import Web3 from 'web3'
import axios from 'axios'
import HDWalletProvider from '@truffle/hdwallet-provider'
import 'dotenv/config'

// wallet provider
const mnemonicWalletSubprovider = new HDWalletProvider({
    mnemonic: {
        phrase: process.env.MNEMONIC
    },
    providerOrUrl: process.env.INFURA_HTTP
})

const web3 = new Web3(mnemonicWalletSubprovider)
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS
let nftContract

async function storeValue(num) {
	return await nftContract.methods.store(num).send({from: '0x380f3609F29713621BeCD22C5a53d4377204BDA8'})
}

async function main(){

	let response = await axios.get('https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=' + NFT_CONTRACT_ADDRESS + '&apikey=9SQVDEWPVU54IQW67IFQCNVG87H5EBTXJT')
	let data = response.data

	// create the smart contract JSON ABI
	let abi_r = await data.result
	let abi = JSON.parse(abi_r)
	console.log('ABI created')

	nftContract = new web3.eth.Contract(
		abi,
		NFT_CONTRACT_ADDRESS
	)

	let storedValue = await nftContract.methods.retrieve().call()
	console.log(storedValue)

	storeValue(20).then((receipt) => {
		console.log(storedValue)
		console.log(receipt)
	})

}

main()