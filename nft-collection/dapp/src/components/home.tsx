import { useState, useEffect, useRef, useCallback } from 'react';
import Web3Modal from 'web3modal';
import { providers, Contract, utils } from 'ethers';
import ethSVG from '../assets/eth.svg';
import consts from '../consts';

function Home() {
  const web3modalref: any = useRef();
  const [ntfMinted, setNFTMinted] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState({
    pause: false,
    startpresale: false,
    mintloading: false,
    withdrawloading: false,
  });

  const getProviderORSigner = async (needSigner = false) => {
    const providerInstance = await web3modalref.current.connect();
    const web3Provider = new providers.Web3Provider(providerInstance);

    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 4) {
      // eslint-disable-next-line
      alert('RINKEBY CONNECTION ONLY!!');
      throw new Error('RINKEBY CONNECTION ONLY!!!');
    }

    if (needSigner) {
      const signer: any = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const getNumOfNFTMinted = useCallback(async () => {
    try {
      const provider = await getProviderORSigner();
      const SefanNFT = new Contract(consts.SEFAN_ADDRESS, consts.ABI, provider);
      const TokenIds = await SefanNFT.tokenIds();
      // eslint-disable-next-line
      console.log(TokenIds, 'here');
      setNFTMinted(TokenIds.toString());
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  }, []);

  const getOwner = useCallback(async () => {
    try {
      const provider = await getProviderORSigner();
      const SefanNFT = new Contract(consts.SEFAN_ADDRESS, consts.ABI, provider);
      const owner = await SefanNFT.owner();
      const signer = await getProviderORSigner(true);
      const connectedAddress = await signer.getAddress();

      if (connectedAddress.toLowerCase() === owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  }, []);

  const checkPresaleStatus = useCallback(async () => {
    try {
      const provider = await getProviderORSigner();
      const SefanNFT = new Contract(consts.SEFAN_ADDRESS, consts.ABI, provider);
      const PRESALE_STARTED = await SefanNFT.presaleStarted();
      setPresaleStarted(PRESALE_STARTED);
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  }, []);

  const getPresaleEndedStatus = useCallback(async () => {
    try {
      const provider = await getProviderORSigner();
      const SefanNFT = new Contract(consts.SEFAN_ADDRESS, consts.ABI, provider);
      const PRESALE_ENDED = await SefanNFT.presaleEnded();
      // eslint-disable-next-line
      const _presaleEnded = PRESALE_ENDED.lt(Math.floor(Date.now() / 1000));
      setPresaleEnded(_presaleEnded);
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  }, []);

  const startPresale = async () => {
    try {
      const signer = await getProviderORSigner(true);
      const SefanNFT = new Contract(consts.SEFAN_ADDRESS, consts.ABI, signer);
      const tx = await SefanNFT.startPresale();
      setLoading((prev) => ({ ...prev, startpresale: true }));
      // set loading
      await tx.wait();
      setLoading((prev) => ({ ...prev, startpresale: false }));
      // disable loading
      setPresaleStarted(true);
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  };

  const withdrawETH = async () => {
    try {
      const signer = await getProviderORSigner(true);
      const SefanNFT = new Contract(consts.SEFAN_ADDRESS, consts.ABI, signer);
      const tx = await SefanNFT.withDraw();
      setLoading((prev) => ({ ...prev, withdrawloading: true }));
      await tx.wait();
      setLoading((prev) => ({ ...prev, withdrawloading: false }));
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  };

  const checkIfSaleIsPaused = useCallback(async () => {
    try {
      const provider = await getProviderORSigner();
      const SefanNFT = new Contract(consts.SEFAN_ADDRESS, consts.ABI, provider);
      // eslint-disable-next-line
      const IsPaused = await SefanNFT._paused();
      setIsPaused(IsPaused);
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  }, []);

  const pauseSale = async () => {
    try {
      const signer = await getProviderORSigner(true);
      const SefanNFT = new Contract(consts.SEFAN_ADDRESS, consts.ABI, signer);
      const tx = await SefanNFT.setPaused(!isPaused);
      // set loading
      setLoading((prev) => ({ ...prev, pause: true }));
      await tx.wait();
      // disable loading
      setLoading((prev) => ({ ...prev, pause: false }));
      checkIfSaleIsPaused();
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  };

  const mint = async () => {
    try {
      const signer = await getProviderORSigner(true);
      const SefanNFT = new Contract(consts.SEFAN_ADDRESS, consts.ABI, signer);
      const tx = await SefanNFT.mint({ value: utils.parseEther('0.01') });
      setLoading((prev) => ({ ...prev, mintloading: true }));
      await tx.wait();
      setLoading((prev) => ({ ...prev, mintloading: false }));
      getNumOfNFTMinted();
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  };

  const connectWallet = useCallback(async () => {
    try {
      await getProviderORSigner();
      setWalletConnected(true);
      await Promise.all([
        getNumOfNFTMinted(),
        checkPresaleStatus(),
        getOwner(),
        checkIfSaleIsPaused(),
        getPresaleEndedStatus(),
      ]);
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  }, [
    getNumOfNFTMinted,
    getOwner,
    checkPresaleStatus,
    checkIfSaleIsPaused,
    getPresaleEndedStatus,
  ]);

  useEffect(() => {
    if (!walletConnected) {
      web3modalref.current = new Web3Modal({
        network: 'rinkeby',
        disableInjectedProvider: false,
        providerOptions: {},
      });
      connectWallet();
    }
  }, [connectWallet, walletConnected]);

  const renderButton = () => {
    if (walletConnected) {
      return (
        <>
          {isOwner && presaleStarted && (
            <>
              <button
                onClick={withdrawETH}
                type="button"
                className={`bg-teal-500 p-3 rounded text-sm text-gray-50 mr-4 ${
                  loading.withdrawloading && 'bg-opacity-25 cursor-not-allowed'
                }`}
                disabled={loading.withdrawloading}>
                {loading.withdrawloading ? 'Loading..' : 'Withdraw Ether'}
              </button>
              <button
                onClick={pauseSale}
                type="button"
                className={`bg-red-500 p-3 rounded text-sm text-gray-50 mr-4 ${
                  loading.pause && 'bg-opacity-25 cursor-not-allowed'
                }`}
                disabled={loading.pause}>
                {isPaused ? 'Resume Sales' : 'Pause NFT Sale'}
              </button>
            </>
          )}
          {isOwner && !presaleStarted && (
            <button
              type="button"
              onClick={startPresale}
              disabled={loading.startpresale}
              className={`bg-sky-500 p-3 rounded text-sm text-sky-50 mr-4 ${
                loading.startpresale && 'bg-opacity-25 cursor-not-allowed'
              }`}>
              START PRESALE
            </button>
          )}
          {presaleStarted && !presaleEnded && !isPaused && (
            <button
              type="button"
              className="bg-sky-500 p-3 rounded text-sm text-sky-50 mr-4">
              PRESALE MINT 🚀
            </button>
          )}
          {presaleStarted && presaleEnded && !isPaused && (
            <button
              type="button"
              className={`bg-sky-500 p-3 rounded text-sm text-sky-50 mr-4 ${
                loading.mintloading && 'bg-opacity-25 cursor-not-allowed'
              }`}
              onClick={mint}
              disabled={loading.mintloading}>
              {!loading.mintloading ? 'MINT 🚀' : 'Loading...'}
            </button>
          )}
        </>
      );
    }
    return (
      <button
        type="button"
        className="bg-sky-500 p-3 rounded text-sm text-sky-50 mr-4"
        onClick={connectWallet}>
        CONNECT WALLET 🚀
      </button>
    );
  };

  return (
    <div className=" mt-4 w-[90%] md:w-[80%] mx-auto flex flex-col md:flex-row justify-between items-center">
      <div className="flex-[0.4]">
        <h1 className="text-sky-500 mb-4 text-2xl md:text-5xl font-semibold">
          SEFAN NFT
        </h1>
        <p className="text-gray-600 mb-3">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita
          veniam eligendi eum.
        </p>
        {ntfMinted !== null && (
          <p className="text-sky-500">{ntfMinted} / 10 NFTs Has Been Minted </p>
        )}
        <div className="my-6">{renderButton()}</div>
        {walletConnected && !presaleStarted && <p>Presale Not Started Yet</p>}
        {walletConnected && isPaused && <p>Sales Currently Paused</p>}
      </div>
      <div className="flex-[0.4]">
        <img src={ethSVG} alt="" className="md:h-[25rem] w-full" />
      </div>
    </div>
  );
}

export default Home;
