// credits: https://medium.com/@varimallashankar/multi-select-dropdown-in-react-build-a-reusable-and-fully-functional-component-623e7a119869

import React, { useState, useEffect, useRef } from "react"
import "./MultiSelectDropdown.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"

const MultiSelectDropdown = ({
  options,
  label,
  maxSelect,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState(value ?? [])
  const [searchText, setSearchText] = useState("")

  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isLimitReached =
    Boolean(maxSelect) && selectedOptions.length >= maxSelect

  // Handle selection
  const handleCheckboxChange = (optionValue) => {
    const isSelected = selectedOptions.includes(optionValue)

    // Block adding a new option once the limit is reached
    if (!isSelected && isLimitReached) return

    const updatedOptions = isSelected
      ? selectedOptions.filter((val) => val !== optionValue)
      : [...selectedOptions, optionValue]

    setSelectedOptions(updatedOptions)
    onChange?.(updatedOptions)
  }

  // Handle "Select All"
  const handleSelectAll = () => {
    const allValues = options.map((option) => option.value)
    const newValues = selectedOptions.length === options.length ? [] : allValues

    setSelectedOptions(newValues)
    onChange?.(newValues)
  }

  // Filter options
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase()),
  )

  return (
    <div ref={dropdownRef} className="multi-select-dropdown-container">
      <label className="multi-select-dropdown-label">{label}</label>
      <div
        className="multi-select-dropdown-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span
          title={
            selectedOptions.length
              ? selectedOptions
                  .map(
                    (val) => options.find((o) => o.value === val)?.label ?? val,
                  )
                  .join(", ")
              : undefined
          }
          className={
            selectedOptions.length > 0
              ? "placeholder-style-selected"
              : "placeholder-style"
          }
        >
          {selectedOptions.length
            ? selectedOptions
                .map(
                  (val) => options.find((o) => o.value === val)?.label ?? val,
                )
                .join(", ")
            : "Please select"}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          color="var(--primary-text-color)"
        />
      </div>

      {isOpen && (
        <div className="multi-select-dropdown-options">
          {/* Search */}
          <div className="multi-select-dropdown-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="multi-select-dropdown-search-input"
            />
          </div>

          {/* Select All: hidden when a max limit is set */}
          {!maxSelect && (
            <label className="multi-select-dropdown-select-all">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={selectedOptions.length === options.length}
                onChange={handleSelectAll}
              />
              Select All
            </label>
          )}

          {/* Options */}
          {filteredOptions.map((option) => {
            const isSelected = selectedOptions.includes(option.value)
            const isDisabled = !isSelected && isLimitReached

            return (
              <label
                key={option.value}
                className={`multi-select-dropdown-option ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
              >
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => handleCheckboxChange(option.value)}
                />
                {option.label}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MultiSelectDropdown
