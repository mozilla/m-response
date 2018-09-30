import React from 'react'
import PropTypes from 'prop-types'

import './field.scss'
import { WithContext as ReactTags } from 'react-tag-input'

const KeyCodes = {
	comma: 188,
	enter: 13,
	space: 32,
	tab: 9
}

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space, KeyCodes.tab]

export default class TagField extends React.Component {
	state = {
		focused: false, tags: [], suggestions: []
	}

	static getDerivedStateFromProps(props, state) {
		return {
			suggestions: (state.suggestions.length) ? state.suggestions : props.suggestions || [],
			tags: (state.tags.length) ? state.tags : props.tags || []
		}
	}

	constructor(props) {
		super(props)
		this.handleDelete = this.handleDelete.bind(this)
		this.handleAddition = this.handleAddition.bind(this)
		this.handleDrag = this.handleDrag.bind(this)
	}

	render() {
		const { focused } = this.state
		const { className, icon, placeholder} = this.props
		return (
			<div className={`form-field-outer ${className} ${focused ? 'form-field-outer--shifted' : ''}`}>
				<div className={`form-field-inner ${focused ? 'form-field-inner--shifted' : ''}`}>
					<img className='form-field-icon' src={icon || '/static/media/icons/message.svg'}/>
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
						classNames={{
							tags: 'tagsClass',
							tagInput: 'form-field-input',
							tagInputField: 'form-field-input',
							selected: 'form-field-input-container',
							tag: 'form-field-tag',
							remove: 'removeClass',
							suggestions: 'form-field-suggestions',
							activeSuggestion: 'activeSuggestionClass'
						}}
						delimiters={delimiters}/>
				</div>
			</div>
		)
	}

	handleDelete(i) {
		const { tags } = this.state
		this.setState({
			tags: tags.filter((tag, index) => index !== i)
		}, () => this.props.onChange(this.state.tags))
	}

	handleAddition(tag) {
		if (this.isSupported(tag.text)) {
			this.setState(
				state => ({ tags: [...state.tags, tag] }),
				() => this.props.onChange(this.state.tags)
			)
		}
	}

	handleDrag(tag, currPos, newPos) {
		const tags = [...this.state.tags]
		const newTags = tags.slice()

		newTags.splice(currPos, 1)
		newTags.splice(newPos, 0, tag)

		// re-render
		this.setState({ tags: newTags }, () => this.props.onChange(this.state.tags))
	}

	isSupported = tag => !!this.state.suggestions.filter(({ text }) => String(text).toUpperCase() === String(tag).toUpperCase()).length

	toggleFocus = () => this.setState({
		focused: !this.state.focused
	}, () => (this.props.onFocus) ? this.props.onFocus() : null)

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
