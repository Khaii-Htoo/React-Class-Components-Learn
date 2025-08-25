import { Component, type ChangeEvent, type ReactNode } from "react";

// https://dummyjson.com/products
type Props = Record<string, never>;
type Product = {
  title: string;
  description: string;
  price: string;
};
type State = {
  products: Product[];
  loading: boolean;
  search: string;
};
class SearchProducts extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      search: "",
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    if (prevState.search !== this.state.search) {
      this.fetchProducts();
    }
  }

  fetchProducts = async () => {
    try {
      const { search } = this.state;
      const url = `https://dummyjson.com/products${
        search ? `/search?q=${search}` : "?limit=10"
      }`;
      const response = await fetch(url);
      const data = await response.json();
      this.setState(() => ({
        products: data.products,
        loading: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount(): void {
    this.fetchProducts();
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState(() => ({
      search: e.target.value,
    }));
  };

  removeSearch = (): void => {
    this.setState(() => ({
      search: "",
    }));
  };

  render(): ReactNode {
    const { loading, products, search } = this.state;
    return (
      <div className="p-20">
        <div className="flex space-x-2">
          <input
            type="text"
            className=" border p-2 rounded-md"
            value={search}
            onChange={(e) => this.handleChange(e)}
          />
          <button
            onClick={this.removeSearch}
            className="p-2 bg-red-400 text-white rounded-md cursor-pointer"
          >
            Clear
          </button>
        </div>
        {loading ? (
          "loading..."
        ) : (
          <div className="">
            {products.length ? (
              <div className=" grid grid-cols-4 gap-3 mt-5">
                {products.map((p, i) => (
                  <div className="p-3 rounded-md border">
                    <p>Title : {p.title}</p>
                    <p>Description : {p.description}</p>
                    <p>Price : {p.price}</p>
                  </div>
                ))}
              </div>
            ) : (
              "not found"
            )}
          </div>
        )}
      </div>
    );
  }
}

export default SearchProducts;
