// @flow

import React, { PureComponent } from 'react';
import { View } from 'react-native';

import { getFeatureFlag, MINIMAL_UI_ENABLED } from '../../../base/flags';
import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { Container } from '../../../base/react';
import { connect } from '../../../base/redux';
import { StyleType } from '../../../base/styles';
import { ChatButton } from '../../../chat';
import { isToolboxVisible } from '../../functions';
import AudioMuteButton from '../AudioMuteButton';
import HangupButton from '../HangupButton';
import VideoMuteButton from '../VideoMuteButton';

import OverflowMenuButton from './OverflowMenuButton';
import styles from './styles';

/**
 * The type of {@link Toolbox}'s React {@code Component} props.
 */
type Props = {

    /**
     * True if only the hang up button will be displayed.
     */
    _yayofonoMinimalUIEnabled: boolean,

    /**
     * The color-schemed stylesheet of the feature.
     */
    _styles: StyleType,

    /**
     * The indicator which determines whether the toolbox is visible.
     */
    _visible: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Implements the conference toolbox on React Native.
 */
class Toolbox extends PureComponent<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Container
                style = { styles.toolbox }
                visible = { this.props._visible }>
                { this._renderToolbar() }
            </Container>
        );
    }

    /**
     * Constructs the toggled style of the chat button. This cannot be done by
     * simple style inheritance due to the size calculation done in this
     * component.
     *
     * @param {Object} baseStyle - The base style that was originally
     * calculated.
     * @returns {Object | Array}
     */
    _getChatButtonToggledStyle(baseStyle) {
        const { _styles } = this.props;

        if (Array.isArray(baseStyle.style)) {
            return {
                ...baseStyle,
                style: [
                    ...baseStyle.style,
                    _styles.chatButtonOverride.toggled
                ]
            };
        }

        return {
            ...baseStyle,
            style: [
                baseStyle.style,
                _styles.chatButtonOverride.toggled
            ]
        };
    }

    /**
     * Renders the toolbar. In order to avoid a weird visual effect in which the
     * toolbar is (visually) rendered and then visibly changes its size, it is
     * rendered only after we've figured out the width available to the toolbar.
     *
     * @returns {React$Node}
     */
    _renderToolbar() {
        const { _yayofonoMinimalUIEnabled, _styles } = this.props;
        const { buttonStyles, buttonStylesBorderless, hangupButtonStyles, toggledButtonStyles } = _styles;

        if (_yayofonoMinimalUIEnabled) {
            const NEW_BUTTON_SIZE = 100;
            hangupButtonStyles.style.borderRadius = NEW_BUTTON_SIZE / 2;
            hangupButtonStyles.style.height = NEW_BUTTON_SIZE;
            hangupButtonStyles.style.width = NEW_BUTTON_SIZE;
        }

        return (
            <View
                accessibilityRole = 'toolbar'
                pointerEvents = 'box-none'
                style = { styles.toolbar }>
                {
                    _yayofonoMinimalUIEnabled ? undefined : 
                    <AudioMuteButton
                    styles = { buttonStyles }
                    toggledStyles = { toggledButtonStyles } />
                }
                <HangupButton
                    styles = { hangupButtonStyles } />
                {
                    _yayofonoMinimalUIEnabled ? undefined : 
                    <VideoMuteButton
                        styles = { buttonStyles }
                        toggledStyles = { toggledButtonStyles } />
                }
                {
                    _yayofonoMinimalUIEnabled ? undefined : 
                    <OverflowMenuButton
                        styles = { buttonStylesBorderless }
                        toggledStyles = { toggledButtonStyles } />
                }
            </View>
        );
    }
}

/**
 * Maps parts of the redux state to {@link Toolbox} (React {@code Component})
 * props.
 *
 * @param {Object} state - The redux state of which parts are to be mapped to
 * {@code Toolbox} props.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state: Object): Object {
    const flag = getFeatureFlag(state, MINIMAL_UI_ENABLED, false);
    
    return {
        _yayofonoMinimalUIEnabled: flag,
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
        _visible: isToolboxVisible(state)
    };
}

export default connect(_mapStateToProps)(Toolbox);
