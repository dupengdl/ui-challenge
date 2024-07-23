import { styled } from 'styled-components'

const StyledList = styled.div`
  display: block;
  margin: 0;
  --font-size: 14px;
  --main-color: #2c3137;
  --sub-color: #697584;
`
const ListRow = styled.div`
  display: flex;
  align-items: center;
  .col-logo {
    width: 80px;
  }
  .col-asset {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 350px;
    font-size: var(--font-size);
  }
  .col-balance {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 175px;
    font-size: var(--font-size);
  }
  .col-action {
    flex: 1;
    display: flex;
    gap: 10px;
  }
`
const ListBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 32px;
`
const ColTitle = styled.div`
  font-size: var(--font-size);
  color: var(--sub-color);
`
const AssetItem = styled.div`
  display: flex;
  align-items: center;
  .logo {
    display: block;
    width: 40px;
    height: 40px;
  }
  .bold {
    font-weight: 600;
    color: var(--main-color);
  }
  .sub {
    color: var(--sub-color);
  }
  .btn {
    display: flex;
    align-items: center;
    height: 32px;
    border: none;
    border-radius: 6px;
    padding: 0 12px;
    line-height: 1.2;
    font-size: var(--font-size);
    font-weight: 600;
    color: var(--sub-color);
    background-color: #f5f7fb;
    cursor: pointer;
    &:hover {
      opacity: .8;
    }
  }
`

interface Asset {
  imgSrc: string
  symbol: string
  name: string
  tokenAmount: string
  tokenAmountPrice: string
}

interface AssetListProps {
  list: Asset[]
  onDeposit?: (asset: Asset) => void
  onWithdraw?: (asset: Asset) => void
}

function AssetList({ list, onDeposit, onWithdraw }: AssetListProps) {
  return (
    <StyledList>
      <ListRow>
        <div className="col-logo"></div>
        <div className="col-asset">
          <ColTitle>Asset</ColTitle>
        </div>
        <div className="col-balance">
          <ColTitle>Balance</ColTitle>
        </div>
      </ListRow>
      <ListBody>
        {
          list.map(asset => {
            return (
              <ListRow key={asset.name}>
                <AssetItem>
                  <div className="col-logo">
                    <img src={asset.imgSrc} alt={asset.symbol} className="logo" />
                  </div>
                  <div className="col-asset">
                    <div className="bold">{asset.symbol}</div>
                    <div className="sub">{asset.name}</div>
                  </div>
                  <div className="col-balance">
                    <div className="bold">{asset.tokenAmount}</div>
                    <div className="sub">{asset.tokenAmountPrice}</div>
                  </div>
                  <div className="col-action">
                    <button className="btn" onClick={() => onDeposit?.(asset)}>Deposit</button>
                    <button className="btn" onClick={() => onWithdraw?.(asset)}>Withdraw</button>
                  </div>
                </AssetItem>
              </ListRow>
            )
          })
        }
      </ListBody>
    </StyledList>
  )
}

export default AssetList
