import React from 'react'
import PropTypes from 'prop-types'
import { WithContext as ReactTags } from 'react-tag-input'

import './field.scss'

const KeyCodes = {
  comma: 188,
  enter: 13,
  space: 32,
  tab: 9
}

const delimiters = [
  KeyCodes.comma,
  KeyCodes.enter,
  KeyCodes.space,
  KeyCodes.tab
]

export default class TagField extends React.Component {
  state = {
    focused: false,
    tags: null,
    suggestions: null
  }

  static getDerivedStateFromProps (props, state) {
    return {
      suggestions:
        state.suggestions != null ? state.suggestions : props.suggestions || [],
      tags: state.tags != null ? state.tags : props.tags || []
    }
  }

  constructor (props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
  }

  render () {
    const { focused } = this.state
    const { className, icon, placeholder } = this.props
    console.log(this.state.suggestions)
    return (
      <div
        className={`tag-field-outer ${className} ${
          focused ? 'tag-field-outer--shifted' : ''
        }`}
      >
        <div
          className={`tag-field-inner ${
            focused ? 'tag-field-inner--shifted' : ''
          }`}
        >
          { icon
            ? <img
              className="tag-field-icon"
              src={icon}
              alt=""
            /> : null}
          <ReactTags
            tags={this.state.tags}
            suggestions={this.state.suggestions}
            handleDelete={this.handleDelete}
            handleTagClick={this.handleDelete}
            handleAddition={this.handleAddition}
            handleDrag={this.handleDrag}
            handleInputFocus={() => this.toggleFocus()}
            handleInputBlur={() => this.toggleFocus()}
            autocomplete={true}
            placeholder={placeholder}
            allowUnique={true}
            autofocus={false}
            classNames={{
              tags: 'tag-field-tags',
              tagInput: 'tag-field-input',
              tagInputField: 'tag-field-input-field',
              selected: 'tag-field-input-container',
              tag: 'tag-field-tag',
              remove: 'removeClass',
              suggestions: 'tag-field-suggestions',
              activeSuggestion: 'activeSuggestionClass'
            }}
            delimiters={delimiters}
          />
        </div>
      </div>
    )
  }

  handleDelete (i) {
    const { tags } = this.state
    this.setState(
      {
        tags: tags.filter((tag, index) => index !== i)
      },
      () => this.props.onChange(this.state.tags)
    )
  }

  handleAddition (tag) {
    tag = this.state.suggestions.find(({ text }) => String(text).toUpperCase() === String(tag.text).toUpperCase())
    if (tag && this.isUnique(tag)) {
      this.setState(
        state => ({ tags: [...state.tags, tag] }),
        () => this.props.onChange(this.state.tags)
      )
    }
  }

  handleDrag (tag, currPos, newPos) {
    const tags = [...this.state.tags]
    const newTags = tags.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    // re-render
    this.setState({ tags: newTags }, () => this.props.onChange(this.state.tags))
  }

  isUnique = tag =>
    !this.state.tags.filter(
      ({ id }) => id === tag.id
    ).length

  toggleFocus = () =>
    this.setState(
      {
        focused: !this.state.focused
      },
      () => (this.props.onFocus ? this.props.onFocus() : null)
    )
}

TagField.defaultProps = {
  onChange: () => null
}

TagField.propTypes = {
  className: PropTypes.string.optional,
  icon: PropTypes.string.optional,
  placeholder: PropTypes.string.optional,
  type: PropTypes.string.optional,
  onChange: PropTypes.func.optional,
  suggestions: PropTypes.array.isRequired,
  tags: PropTypes.array.optional
}
