import { forwardRef, PropsWithChildren, useCallback, useMemo, useRef, useState } from 'react'
import { styled } from 'styled-components'

import { AssetOption } from '../store.ts'

const StyledWrapper = styled.div`
  position: relative;
  display: block;
  min-width: 240px;
  --height: 48px;
  --main-color: #2c3137;
  --sub-color: #757575;
`
const Wrapper = forwardRef<HTMLDivElement, PropsWithChildren>(
  ({ children }, ref) => <StyledWrapper ref={ref}>{children}</StyledWrapper>
)
const InputWrapper = styled.div`
  position: relative;
`
const SearchInput = styled.input`
  appearance: none;
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: var(--height);
  line-height: var(--height);
  border: 1px solid #d1d6dd;
  border-radius: 6px;
  padding: 0 20px 0 10px;
  font-size: 16px;
  color: var(--main-color);
  outline: none;
  &:focus, &:hover {
    border-color: #2c3137;
  }
  &::placeholder, &::-webkit-input-placeholder {
    color: var(--sub-color);
  }
`
const DownArrow = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: var(--height);
  width: 20px;
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 2px;
    top: 16px;
    width: 6px;
    height: 6px;
    border-width: 2px;
    border-style: solid;
    border-color: transparent transparent #2c3137 #2c3137;
    transform: rotate(-45deg);
    transition: all 0.3s;
  }
`
const ListWrapper = styled.div`
  position: absolute;
  left: 0;
  top: var(--height);
  overflow-y: auto;
  max-height: 304px;
  width: 100%;
  //border: 1px solid #434b55;
  border-radius: 6px;
  background-color: #1d2024;
  z-index: 100;
  scrollbar-width: thin;
  scrollbar-color: #697584 transparent;
`
const OptionItem = styled.div`
  display: block;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #1d2024;
  color: #eef2f8;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: #25292e;
  }
  .item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .logo {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    font-weight: 500;
    .img {
      max-width: 100%;
    }
  }
  .label {
    font-size: 18px;
    color: #eef2f8;
  }
`
const NoResult = styled.div`
  height: var(--height);
  line-height: var(--height);
  color: #eef2f8;
  text-align: center;
  user-select: none;
  cursor: text;
`

interface ComboBoxProps {
  placeholder?: string
  searchKey?: 'value' | 'label'
  options: AssetOption[]
  onSelect?: (option: AssetOption) => void
}

function ComboBox({ placeholder = 'Choose an asset', searchKey = 'value', options, onSelect }: ComboBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [searchText, setSearchText] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredOptions = useMemo(() => {
    return options.filter(option => option[searchKey].toLowerCase().includes(searchText.toLowerCase()))
  }, [options, searchKey, searchText])
  const showList = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])
  const hideList = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false)
    }, 100)
  }, [setIsOpen])
  const toggleList = useCallback(() => {
    if (isOpen) {
      hideList()
    } else {
      showList()
    }
  }, [hideList, isOpen, showList])
  const handleSelect = useCallback((option: AssetOption) => {
    console.log(11111, option.label)
    setIsOpen(false)
    setSearchText(option.label)
    onSelect?.(option)
  }, [onSelect])

  return (
    <Wrapper ref={containerRef}>
      <InputWrapper>
        <SearchInput
          placeholder={placeholder}
          value={searchText}
          onInput={e => setSearchText(e.currentTarget.value)}
          onFocus={showList}
          onBlur={hideList}
        />
        <DownArrow onClick={toggleList} />
      </InputWrapper>
      {
        isOpen && (
          <ListWrapper ref={listRef}>
            {
              filteredOptions.length > 0 ?
                filteredOptions.map(asset => {
                  return (
                    <OptionItem key={asset.name} onClick={() => handleSelect(asset)}>
                      <div className="item">
                        <div className="logo">
                          <img src={asset.iconUrl} alt={asset.symbol} className="img" />
                        </div>
                        <div className="label">
                          {asset.symbol}
                        </div>
                      </div>
                    </OptionItem>
                  )
                }) : <NoResult>No result</NoResult>
            }
          </ListWrapper>
        )
      }
    </Wrapper>
  )
}

export default ComboBox
