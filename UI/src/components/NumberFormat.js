import React from 'react';
import PropTypes from 'prop-types';
import { NumericFormat } from 'react-number-format';
import { styled } from '@mui/system';
import _ from 'lodash';

const RRNumberFormat = (props) => {
	const {
		inputRef, onChange, prefix, name, decimalScale, maxValue, ...other
	} = props;
	const _maxValue = _.isNil(maxValue) ? 999999999 : maxValue;
	return (
		<StyledNumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={(values) => {
				onChange({
					target: {
						name,
						value: values.value,
					},
				});
			}}
			thousandSeparator
			isNumericString
			prefix={prefix}
			thousandsGroupStyle="thousand"
			decimalSeparator="."
			displayType="input"
			allowNegative={false}
			decimalScale={decimalScale}
			fixedDecimalScale
			// style={{
			// direction: 'rtl',
			// }}
			isAllowed={(values) => {
				const { floatValue } = values;
				return floatValue < _maxValue;
			}}
		/>

	);
}

RRNumberFormat.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	prefix: PropTypes.string,
	decimalScale: PropTypes.string,
	maxValue: PropTypes.string
};

const StyledNumberFormat = styled(NumericFormat)({
	padding: '5px',
	width: '75px',
});

export default RRNumberFormat;