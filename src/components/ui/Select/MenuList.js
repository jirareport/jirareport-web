import React from 'react';
import { VariableSizeList } from 'react-window';

const sum = (a, b) => a + b;

const OptionWrapper = props => {
    const { style, index, data } = props;
    return <div style={style}>{data[index]}</div>;
};


class MenuList extends React.PureComponent {
    state = {
        rawChildren: null,
        maxHeight: null,
        currentIndex: 0,
    };

    list = React.createRef();

    static getDerivedStateFromProps({ children: rawChildren, maxHeight }, state) {
        if (rawChildren !== state.rawChildren || maxHeight !== state.maxHeight) {
            const children = Array.isArray(rawChildren) ? rawChildren : [rawChildren];

            const heights = children.map(({ props: { label } }) => 50);
            const totalHeight = heights.reduce(sum);
            const height = Math.min(maxHeight, totalHeight);
            const itemCount = children.length;

            const currentIndex = Math.max(children.findIndex(({ props: { isFocused } }) => isFocused), 0);

            const estimatedItemSize = Math.floor(totalHeight / itemCount);

            return {
                height,
                itemCount,
                heights,
                estimatedItemSize,
                maxHeight,
                rawChildren,
                currentIndex,
            };
        }

        return null;
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const { currentIndex } = this.state;
        this.list.current.scrollToItem(currentIndex);
    }

    itemSize = index => {
        return this.state.heights[index];
    };

    render() {
        const { children, innerRef } = this.props;
        const { height, itemCount, estimatedItemSize } = this.state;

        return (
            <div ref={innerRef} className="react-select__menu-list">
                <VariableSizeList
                    ref={this.list}
                    height={height}
                    itemCount={itemCount}
                    itemSize={this.itemSize}
                    estimatedItemSize={estimatedItemSize}
                    itemData={Array.isArray(children) ? children : [children]}
                >
                    {OptionWrapper}
                </VariableSizeList>
            </div>
        );
    }
}

export default MenuList;
