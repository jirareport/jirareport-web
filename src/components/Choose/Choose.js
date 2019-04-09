import { Children } from "react";

const Choose = ({ children, current }) => {
    for (let it of Children.toArray(children)) {
        if (it.type.toString() === Symbol("react.fragment").toString()) {
            const result = Choose({ children: it.props.children, current });
            if (result) {
                return result;
            }
        } else if (it.props.active === current) {
            return it;
        }
    }

    return null;
};

export default Choose;
