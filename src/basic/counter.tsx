import { Component, type ReactNode } from "react";

interface Props {
  title: string;
}

interface State {
  count: number;
  isShow: boolean;
}

class Counter extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      count: 0,
      isShow: true,
    };
  }
  IncreaeseCount = (): void => {
    this.setState((prev) => ({
      count: prev.count + 1,
    }));
  };
  decreaseCount = (): void => {
    this.setState((prev) => ({
      count: prev.count - 1,
    }));
  };
  toggleShow = (): void => {
    this.setState((prev) => ({
      isShow: !prev.isShow,
    }));
  };
  render(): ReactNode {
    const { title } = this.props;
    const { count, isShow } = this.state;
    return (
      <div className="">
        <h1>{title}</h1>
        {isShow ? (
          <>
            <p>{count}</p>
            <button onClick={this.IncreaeseCount}>+</button>
            <button onClick={this.decreaseCount}>-</button>
          </>
        ) : (
          "nothing show"
        )}
        <button onClick={this.toggleShow}>Toggle show</button>
      </div>
    );
  }
}

export default Counter;
