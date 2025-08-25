// components/ProductDashboard.tsx
import React, { Component } from "react";
import { DataTable, type ColumnConfig } from "./components/datatable";

interface DashboardState {
  activeTab: string;
}

class ProductDashboard extends Component<{}, DashboardState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      activeTab: "all",
    };
  }

  // Compact columns for mobile view
  getMobileColumns = (): ColumnConfig[] => [
    {
      key: "thumbnail",
      title: "",
      width: "60px",
      render: (thumbnail: string, record: any) => (
        <img
          src={thumbnail}
          alt=""
          style={{ width: "40px", height: "40px", borderRadius: "4px" }}
        />
      ),
    },
    {
      key: "title",
      title: "Product",
      render: (title: string, record: any) => (
        <div>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>{title}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.category}
          </div>
          <div
            style={{ fontSize: "12px", color: "#28a745", fontWeight: "bold" }}
          >
            ${record.price}
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      title: "",
      width: "60px",
      render: (value: any, record: any) => (
        <button
          style={{
            padding: "4px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "4px",
          }}
        >
          ⋯
        </button>
      ),
    },
  ];

  // Detailed columns for desktop
  getDesktopColumns = (): ColumnConfig[] => [
    {
      key: "thumbnail",
      title: "ပုံ",
      width: "80px",
      align: "center",
      render: (thumbnail: string) => (
        <img
          src={thumbnail}
          alt=""
          style={{ width: "50px", height: "50px", borderRadius: "4px" }}
        />
      ),
    },
    {
      key: "title",
      title: "အမည်",
      sortable: true,
      width: "200px",
    },
    {
      key: "category",
      title: "အမျိုးအစား",
      sortable: true,
      width: "120px",
    },
    {
      key: "price",
      title: "စျေးနှုန်း",
      sortable: true,
      align: "right",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      key: "stock",
      title: "စတော့",
      sortable: true,
      align: "center",
      render: (stock: number) => (
        <span style={{ color: stock > 0 ? "#28a745" : "#dc3545" }}>
          {stock > 0 ? `${stock} ခု` : "မရှိ"}
        </span>
      ),
    },
    {
      key: "rating",
      title: "Rating",
      sortable: true,
      align: "center",
      render: (rating: number) => `⭐ ${rating.toFixed(1)}`,
    },
  ];

  renderTabButtons() {
    const tabs = [
      { key: "all", label: "🌟 အားလုံး", category: undefined },
      { key: "smartphones", label: "📱 Smartphones", category: "smartphones" },
      { key: "laptops", label: "💻 Laptops", category: "laptops" },
      { key: "fragrances", label: "🌸 Fragrances", category: "fragrances" },
      { key: "skincare", label: "✨ Skincare", category: "skincare" },
    ];

    return (
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          overflowX: "auto",
          padding: "10px 0",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => this.setState({ activeTab: tab.key })}
            style={{
              padding: "10px 20px",
              border: "2px solid #dee2e6",
              borderRadius: "8px",
              backgroundColor:
                this.state.activeTab === tab.key ? "#007bff" : "white",
              color: this.state.activeTab === tab.key ? "white" : "#495057",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontWeight: this.state.activeTab === tab.key ? "bold" : "normal",
              transition: "all 0.3s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  render() {
    const { activeTab } = this.state;

    // Get current tab config
    const currentTab = [
      { key: "all", category: undefined, title: "🌟 All Products" },
      { key: "smartphones", category: "smartphones", title: "📱 Smartphones" },
      { key: "laptops", category: "laptops", title: "💻 Laptops" },
      { key: "fragrances", category: "fragrances", title: "🌸 Fragrances" },
      { key: "skincare", category: "skincare", title: "✨ Skincare" },
    ].find((tab) => tab.key === activeTab) || {
      key: "all",
      category: undefined,
      title: "🌟 All Products",
    };

    // Responsive columns
    const isMobile = window.innerWidth < 768;
    const columns = isMobile
      ? this.getMobileColumns()
      : this.getDesktopColumns();

    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Dashboard Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h1
              style={{
                margin: "0 0 10px 0",
                color: "#2c3e50",
                fontSize: "28px",
              }}
            >
              🚀 Advanced Products Dashboard
            </h1>
            <p
              style={{
                margin: 0,
                color: "#7f8c8d",
                fontSize: "16px",
              }}
            >
              Professional DataTable နဲ့ Products တွေကို လွယ်ကူစွာ စီမံခန့်ခွဲပါ
            </p>
          </div>

          {/* Tab Navigation */}
          {this.renderTabButtons()}

          {/* Main DataTable */}
          <DataTable
            title={currentTab.title}
            columns={columns}
            category={currentTab.category}
            pageSize={isMobile ? 10 : 15}
            showSearch={true}
            showPagination={true}
          />

          {/* Statistics Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              marginTop: "30px",
            }}
          >
            {[
              {
                title: "စုစုပေါင်း Products",
                value: "2,500+",
                icon: "📦",
                color: "#007bff",
              },
              {
                title: "Categories",
                value: "15",
                icon: "🏷️",
                color: "#28a745",
              },
              {
                title: "ရောင်းရတဲ့ Products",
                value: "1,890",
                icon: "✅",
                color: "#17a2b8",
              },
              {
                title: "စတော့ မရှိတာ",
                value: "45",
                icon: "⚠️",
                color: "#ffc107",
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  borderTop: `4px solid ${stat.color}`,
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: stat.color,
                    marginBottom: "4px",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "14px", color: "#6c757d" }}>
                  {stat.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ProductDashboard;
