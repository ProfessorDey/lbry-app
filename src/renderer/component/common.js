import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { formatCredits, formatFullPrice } from 'util/formatCredits';
import Native from 'native';

/* eslint-disable no-underscore-dangle, react/jsx-filename-extension, react/prop-types */
export class TruncatedText extends React.PureComponent {
  static propTypes = {
    lines: PropTypes.number,
  };

  static defaultProps = {
    lines: null,
  };

  render() {
    return (
      <span className="truncated-text" style={{ WebkitLineClamp: this.props.lines }}>
        {this.props.children}
      </span>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
export class BusyMessage extends React.PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/require-default-props
    message: PropTypes.string,
  };

  render() {
    return (
      <span>
        {this.props.message} <span className="busy-indicator" />
      </span>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp, react/prefer-stateless-function
export class CurrencySymbol extends React.PureComponent {
  render() {
    return <span>LBC</span>;
  }
}

// eslint-disable-next-line react/no-multi-comp
export class CreditAmount extends React.PureComponent {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    precision: PropTypes.number,
    // eslint-disable-next-line react/require-default-props
    isEstimate: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    showFree: PropTypes.bool,
    showFullPrice: PropTypes.bool,
    showPlus: PropTypes.bool,
    look: PropTypes.oneOf(['indicator', 'plain', 'fee']),
  };

  static defaultProps = {
    precision: 2,
    label: true,
    showFree: false,
    look: 'indicator',
    showFullPrice: false,
    showPlus: false,
  };

  render() {
    // eslint-disable-next-line no-restricted-properties
    const minimumRenderableAmount = Math.pow(10, -1 * this.props.precision);
    const { amount, precision, showFullPrice } = this.props;

    let formattedAmount;
    const fullPrice = formatFullPrice(amount, 2);

    if (showFullPrice) {
      formattedAmount = fullPrice;
    } else {
      formattedAmount =
        amount > 0 && amount < minimumRenderableAmount
          ? `<${minimumRenderableAmount}`
          : formatCredits(amount, precision);
    }

    let amountText;
    if (this.props.showFree && parseFloat(this.props.amount) === 0) {
      amountText = __('free');
    } else {
      if (this.props.label) {
        const label =
          // eslint-disable-next-line no-nested-ternary
          typeof this.props.label === 'string'
            ? this.props.label
            : parseFloat(amount) === 1 ? __('credit') : __('credits');

        amountText = `${formattedAmount} ${label}`;
      } else {
        amountText = formattedAmount;
      }
      if (this.props.showPlus && amount > 0) {
        amountText = `+${amountText}`;
      }
    }

    return (
      <span className={`credit-amount credit-amount--${this.props.look}`} title={fullPrice}>
        <span>{amountText}</span>
        {this.props.isEstimate ? (
          <span
            className="credit-amount__estimate"
            title={__('This is an estimate and does not include data fees')}
          >
            *
          </span>
        ) : null}
      </span>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
export class Thumbnail extends React.PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/require-default-props
    src: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this._defaultImageUri = Native.imagePath('default-thumb.svg');
    this._maxLoadTime = 10000;
    this._isMounted = false;

    this.state = {
      imageUri: this.props.src || this._defaultImageUri,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
      // eslint-disable-next-line react/no-string-refs
      if (this._isMounted && !this.refs.img.complete) {
        this.setState({
          imageUri: this._defaultImageUri,
        });
      }
    }, this._maxLoadTime);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleError() {
    if (this.state.imageUrl !== this._defaultImageUri) {
      this.setState({
        imageUri: this._defaultImageUri,
      });
    }
  }

  render() {
    const className = this.props.className ? this.props.className : '';
    const otherProps = Object.assign({}, this.props);
    delete otherProps.className;
    /* eslint-disable react/no-string-refs */
    return (
      <img
        alt=""
        ref="img"
        onError={() => {
          this.handleError();
        }}
        {...otherProps}
        className={className}
        src={this.state.imageUri}
      />
    );
  }
}
