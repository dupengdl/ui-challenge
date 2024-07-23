import { create, type StateCreator } from 'zustand'
import { type Chain, type Asset, type AssetList } from '@chain-registry/types'
import { assets, chains } from 'chain-registry'

export interface AssetItem {
  imgSrc: string
  symbol: string
  name: string
  tokenAmount: string
  tokenAmountPrice: string
}

export interface AssetOption extends Asset {
  label: string
  value: string
  iconUrl?: string
}

interface StoreType {
  readonly selectedChain: Chain
  readonly assets: AssetList[]
  readonly assetList: AssetItem[]
  addAssetList: (asset: Asset) => void
}

const randomPick = (list: Asset[], count = 2) => {
  const result = []
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * list.length)
    result.push(list[randomIndex])
  }
  return result
}

const addListProperties = (asset: Asset) => {
  const base = Math.random() * 100
  const tokenAmount = (Math.random() * base).toFixed(2)
  const tokenAmountPrice = (Math.random() * base).toFixed(2)
  return {
    ...asset,
    imgSrc: asset.logo_URIs?.png || asset.logo_URIs?.jpeg || asset.logo_URIs?.svg || '',
    tokenAmount,
    tokenAmountPrice,
  }
}

const selectedChain = chains.find(chain => chain.chain_name === 'osmosis') as Chain
const chainAssets = assets.find(asset => asset.chain_name === selectedChain.chain_name)?.assets ?? []
const assetList = randomPick(chainAssets).map(asset => addListProperties(asset))

const stateCreator: StateCreator<StoreType> = (set, get): StoreType => {
  return {
    selectedChain,
    assets,
    assetList,
    addAssetList: (asset) => {
      const oldAssetList = get().assetList
      const assetList = [...oldAssetList, addListProperties(asset)]
      set({ assetList })
    },
  }
}

const useStore = create<StoreType>(stateCreator)

export default useStore
