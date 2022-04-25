import { useEffect, useRef, useState, useCallback } from 'react';
import { providers, Contract } from 'ethers';
import Web3Modal from 'web3modal';
import { ABI } from '../constants';
import Layout from './layout';
import ethSVG from '../assets/eth.svg';

function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [isWhiteListed, setIswhiteListed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfwhitelisted, setNumberOfWhiteListed] = useState(null);

  const web3ModalRef: any = useRef();
  const getProviderORSigner = async (needSigner = false) => {
    const instance = await web3ModalRef.current.connect();
    const provider = new providers.Web3Provider(instance);
    const { chainId } = await provider.getNetwork();
    if (chainId !== 4) {
      // eslint-disable-next-line
      alert('Rinkeby Connection Only');
      throw new Error('Rinkeby Connection Only');
    }
    if (needSigner) {
      const signer: any = provider.getSigner();
      return signer;
    }
    return provider;
  };

  const getNumberOfWhiteListed = useCallback(async () => {
    try {
      const provider = await getProviderORSigner();
      const whitelistContract = new Contract(
        '0x65eEACc74dC5B132fB28BF32A966903E48d9e51F',
        ABI,
        provider
      );
      const NumOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhiteListed(NumOfWhitelisted);
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  }, []);

  const checkIfAddressInWhitelist = useCallback(async () => {
    try {
      const signer = await getProviderORSigner(true);

      const whitelistContract = new Contract(
        '0x65eEACc74dC5B132fB28BF32A966903E48d9e51F',
        ABI,
        signer
      );
      const address = await signer.getAddress();
      const IsWhiteListed = await whitelistContract.whitelistedAddresses(
        address
      );
      setIswhiteListed(IsWhiteListed);
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  }, []);

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderORSigner(true);

      const whitelistContract = new Contract(
        '0x65eEACc74dC5B132fB28BF32A966903E48d9e51F',
        ABI,
        signer
      );
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhiteListed();
      setIswhiteListed(true);
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  };

  const connectWallet = useCallback(async () => {
    try {
      await getProviderORSigner();
      setWalletConnected(true);
      checkIfAddressInWhitelist();
      getNumberOfWhiteListed();
    } catch (error: any) {
      // eslint-disable-next-line
      console.error(error.message);
    }
  }, [checkIfAddressInWhitelist, getNumberOfWhiteListed]);

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected, connectWallet]);

  const renderButton = () => {
    if (walletConnected) {
      if (isWhiteListed) {
        return (
          <p className="text-sky-500 text-sm">
            Thanks For Joinng The Whitelist
          </p>
        );
      }
      return (
        <button
          type="button"
          className={`bg-sky-500 rounded  p-4 mt-4 md:w-40 text-gray-50 uppercase text-sm focus:ring-4 ring-sky-500 ring-offset-0 transition  ring-opacity-40 ${
            loading && 'bg-opacity-30'
          } `}
          onClick={addAddressToWhitelist}
          disabled={loading}>
          {loading ? 'loading' : 'Join Whitelist'}
        </button>
      );
    }
    return (
      <button
        type="button"
        className="bg-sky-500 rounded  p-4 mt-4 md:w-40 text-gray-50 uppercase text-sm focus:ring-4 ring-sky-500 ring-offset-0 transition  ring-opacity-40 "
        onClick={connectWallet}>
        Connect Wallet
      </button>
    );
  };

  return (
    <Layout>
      <div className="min-h-[80vh]">
        <div className="w-[80%] flex flex-col md:flex-row items-center justify-between mx-auto">
          <div className="md:flex-[0.45] mb-5 md:mb-0">
            <h2 className="mb-3 text-sky-500 text-xl md:text-4xl font-bold">
              Whitelist Registration
            </h2>
            <p className=" text-sm md:text-base font-sans  text-gray-400 leading-loose">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
              possimus molestias natus placeat cumque id illo atque provident ex
              blanditiis.
            </p>
            {numberOfwhitelisted !== null && (
              <p>{numberOfwhitelisted} / 10 addresses have been whitelisted</p>
            )}
            {renderButton()}
          </div>
          <div className="md:flex-[0.5]">
            <img src={ethSVG} alt="" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
