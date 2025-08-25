import React, { Component } from "react";

interface State {
  products: any[];
  loading: boolean;
  count: number;
}

class BasicLifecycle extends Component<{}, State> {
  private intervalId: number | null = null;

  constructor(props: {}) {
    super(props);
    console.log("1️⃣ Constructor: Component စတင်နေပါသည်");

    this.state = {
      products: [],
      loading: true,
      count: 0,
    };
  }

  componentDidMount() {
    this.fetchProducts();
    this.intervalId = setInterval(() => {
      this.setState((prev) => ({ count: prev.count + 1 }));
    }, 2000);
  }

  componentDidUpdate(prevProps: {}, prevState: State) {
    console.log("3️⃣ ComponentDidUpdate: Component update ဖြစ်တယ!");
    if (this.state.count === 10 && prevState.count !== 10) {
      console.log("Count 10 ရောက်ပြီ! Products ပြန်ရယူမယ်");
      this.fetchProducts();
    }
  }

  componentWillUnmount() {
    console.log("4️⃣ ComponentWillUnmount: Component ပျက်သွားပါပြီ!");

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  fetchProducts = async () => {
    this.setState({ loading: true });

    try {
      const response = await fetch("https://dummyjson.com/products?limit=3");
      const data = await response.json();

      this.setState({
        products: data.products,
        loading: false,
      });

      console.log("✅ Products ရယူပြီးပါပြီ");
    } catch (error) {
      this.setState({ loading: false });
      console.log("❌ Error:", error);
    }
  };

  render() {
    console.log("🎨 Render: Component ကို render လုပ်နေပါသည်");

    const { products, loading, count } = this.state;

    return (
      <div style={{ padding: "20px" }}>
        <h1>🔄 Lifecycle Example</h1>
        <p>⏱️ Count: {count} (တစ် 2 စက္ကန့်တိုင်း တိုးမယ်)</p>

        {loading ? (
          <p>⏳ Loading...</p>
        ) : (
          <div>
            <h3>📦 Products ({products.length} ခု):</h3>
            {products.map((product, index) => (
              <div
                key={product.id}
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "5px",
                }}
              >
                <strong>
                  {index + 1}. {product.title}
                </strong>
                <br />
                💰 ${product.price}
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: "12px", color: "#666" }}>
          💡 Browser Console ကို ကြည့်ပြီး lifecycle methods တွေ ဘယ်အချိန်မှာ
          ခေါ်သလဲ လေ့လာပါ
        </p>
      </div>
    );
  }
}

export default BasicLifecycle;
