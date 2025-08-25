import { Component, type ReactNode } from "react";

type Props = Record<string, never>;

type Product = {
  title: string;
  price: number;
};

type State = {
  products: Product[];
  loading: boolean;
};

class SampleProducts extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
    };
  }
  fetchProducts = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products?limit=5");
      const data = await response.json();

      this.setState({
        products: data.products,
        loading: false,
      });
    } catch (error) {
      console.log("Error:", error);
      this.setState({ loading: false });
    }
  };
  componentDidMount(): void {
    this.fetchProducts();
  }
  render(): ReactNode {
    const { loading, products } = this.state;
    return (
      <>
        {loading ? (
          "loading..."
        ) : (
          <div className="">
            {products.map((p, i) => (
              <div key={i}>
                <p>title : {p.title}</p>
                <p>title : {p.price}</p>
                <hr />
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
}

export default SampleProducts;
