import { useCallback, useMemo, useState } from 'react'
import { styled } from 'styled-components'

import viteLogo from '/vite.svg'

import useStore, { type AssetItem, AssetOption } from './store'
import AssetList from './components/AssetList'
import ComboBox from './components/ComboBox.tsx'
import useModal from './hooks/useModal'

const StyledApp = styled.div`
  display: block;
  min-height: 100vh;
  width: 100%;
  .extra {
    margin-bottom: 20px;
  }
`
const Header = styled.header`
  display: flex;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  border-bottom: 1px solid #d9d9d9;
  .logo {
    display: flex;
    align-items: center;
    padding: 8px 0;
    .img {
      margin-right: 10px;
      height: 24px;
      object-fit: contain;
    }
  }
  .nav {
    display: inline-block;
    list-style: none;
    margin: 0 0 0 10px;
    padding: 0;
    .link {
      display: inline-block;
      font-weight: bold;
      margin-right: 10px;
      cursor: pointer;
    }
  }
`
const Main = styled.main`
  padding: 10px 20px;
`
const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  height: 32px;
  border: none;
  border-radius: 6px;
  padding: 0 12px;
  line-height: 1.2;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  background-color: #2539c9;
  cursor: pointer;
  &:hover {
    opacity: .8;
  }
`
const SearchBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

function App() {
  const selectedChain = useStore((state) => state.selectedChain)
  const assetList = useStore((state) => state.assetList)
  const assets = useStore((state) => state.assets)
  const addAssetList = useStore((state) => state.addAssetList)
  const [AddAssetModal, openAddAssetModal, closeAddAssetModal] = useModal()
  const [DepositModal, openDepositModal] = useModal()
  const [depositAsset, setDepositAsset] = useState<AssetItem>()
  const [selectedAssetOption, setSelectedAssetOption] = useState<AssetOption>()

  // filter out already added assets
  const assetsOptions = useMemo<AssetOption[]>(() => {
    const chainAssets = assets.find(asset => asset.chain_name === selectedChain.chain_name)?.assets ?? []
    const candidateAssets = chainAssets.filter(asset => !(assetList.map(item => item.symbol).includes(asset.symbol)))
    return candidateAssets.map(asset => {
      return {
        ...asset,
        label: asset.symbol,
        value: asset.name,
        iconUrl: asset.logo_URIs?.png || asset.logo_URIs?.jpeg || asset.logo_URIs?.svg,
      }
    }).slice(0, 10)
  }, [assetList, assets, selectedChain])
  const onDeposit = useCallback((asset: AssetItem) => {
    openDepositModal()
    setDepositAsset(asset)
  }, [openDepositModal])
  const onWithdraw = useCallback((asset: AssetItem) => {
    console.log('Withdraw', asset)
  }, [])
  const onSelectAsset = useCallback((assetOption: AssetOption) => {
    setSelectedAssetOption(assetOption)
  }, [])
  const handleAddAsset = useCallback(() => {
    if (!selectedAssetOption) return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label, value, iconUrl, ...asset } = selectedAssetOption
    addAssetList(asset)
    closeAddAssetModal()
  }, [addAssetList, closeAddAssetModal, selectedAssetOption])

  return (
    <StyledApp>
      <Header>
        <div className="logo">
          <img src={viteLogo} className="img" alt="Vite logo" />
          Site Logo
        </div>
        <nav className="nav">
          <a className="link">Products</a>
          <a className="link">Blog</a>
          <a className="link">About</a>
        </nav>
      </Header>
      <Main>
        <div className="extra">
          <PrimaryButton onClick={openAddAssetModal}>Add Asset</PrimaryButton>
          <AddAssetModal>
            <SearchBox>
              <div>
                <ComboBox
                  searchKey="label"
                  options={assetsOptions}
                  onSelect={onSelectAsset} />
              </div>
              <PrimaryButton onClick={handleAddAsset}>Confirm</PrimaryButton>
            </SearchBox>
          </AddAssetModal>
          <DepositModal>
            <div style={{ width: '100%', textAlign: 'center' }}>
              Deposit Modal for {depositAsset?.symbol}.
            </div>
          </DepositModal>
        </div>
        <AssetList list={assetList} onDeposit={onDeposit} onWithdraw={onWithdraw} />
      </Main>
    </StyledApp>
  )
}

export default App
