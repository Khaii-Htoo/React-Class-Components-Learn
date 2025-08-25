// components/DataTable.tsx
import React, { Component } from "react";
import {
  TableService,
  type Product,
  type TableQueryParams,
} from "../services/TableService";
import { LoadingService } from "../services/LoadingService";

export interface ColumnConfig {
  key: string;
  title: string;
  width?: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface DataTableProps {
  columns: ColumnConfig[];
  pageSize?: number;
  showSearch?: boolean;
  showPagination?: boolean;
  title?: string;
  category?: string;
}

interface DataTableState {
  data: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  total: number;
  searchQuery: string;
  sortColumn: string;
  sortOrder: "asc" | "desc";
  selectedRows: number[];
}

export class DataTable extends Component<DataTableProps, DataTableState> {
  private tableService: TableService;
  private searchTimeoutId: number | null = null;

  constructor(props: DataTableProps) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      error: null,
      currentPage: 1,
      pageSize: props.pageSize || 10,
      total: 0,
      searchQuery: "",
      sortColumn: "",
      sortOrder: "asc",
      selectedRows: [],
    };

    this.tableService = new TableService();
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: DataTableProps, prevState: DataTableState) {
    const { currentPage, pageSize, searchQuery, sortColumn, sortOrder } =
      this.state;

    const shouldRefetch =
      prevState.currentPage !== currentPage ||
      prevState.pageSize !== pageSize ||
      prevState.searchQuery !== searchQuery ||
      prevState.sortColumn !== sortColumn ||
      prevState.sortOrder !== sortOrder ||
      prevProps.category !== this.props.category;

    if (shouldRefetch) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    try {
      this.setState({ loading: true, error: null });

      const { currentPage, pageSize, searchQuery, sortColumn, sortOrder } =
        this.state;

      const params: TableQueryParams = {
        limit: pageSize,
        skip: (currentPage - 1) * pageSize,
        q: searchQuery,
        sortBy: sortColumn,
        order: sortOrder,
      };

      let response;
      if (this.props.category) {
        response = await this.tableService.getProductsByCategory(
          this.props.category,
          params
        );
      } else {
        response = await this.tableService.getProducts(params);
      }

      this.setState({
        data: response.data.products,
        total: response.data.total,
        loading: false,
      });
    } catch (error: any) {
      this.setState({
        loading: false,
        error: error.message || "Data ရယူ၍မရပါ",
      });
    }
  };

  handleSearch = (query: string) => {
    this.setState({ searchQuery: query, currentPage: 1 });

    // Debounce search
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId);
    }

    this.searchTimeoutId = window.setTimeout(() => {
      this.fetchData();
    }, 500);
  };

  handleSort = (column: string) => {
    const { sortColumn, sortOrder } = this.state;

    let newOrder: "asc" | "desc" = "asc";
    if (sortColumn === column && sortOrder === "asc") {
      newOrder = "desc";
    }

    this.setState({
      sortColumn: column,
      sortOrder: newOrder,
      currentPage: 1,
    });
  };

  handlePageChange = (page: number) => {
    this.setState({ currentPage: page });
  };

  handlePageSizeChange = (size: number) => {
    this.setState({
      pageSize: size,
      currentPage: 1,
    });
  };

  handleRowSelect = (productId: number, selected: boolean) => {
    this.setState((prevState) => {
      const selectedRows = selected
        ? [...prevState.selectedRows, productId]
        : prevState.selectedRows.filter((id) => id !== productId);

      return { selectedRows };
    });
  };

  handleSelectAll = (selected: boolean) => {
    this.setState({
      selectedRows: selected ? this.state.data.map((item) => item.id) : [],
    });
  };

  renderTableHeader() {
    const { columns } = this.props;
    const { sortColumn, sortOrder, data, selectedRows } = this.state;

    return (
      <thead>
        <tr style={{ backgroundColor: "#f8f9fa" }}>
          <th style={{ padding: "12px", width: "50px", textAlign: "center" }}>
            <input
              type="checkbox"
              checked={data.length > 0 && selectedRows.length === data.length}
              onChange={(e) => this.handleSelectAll(e.target.checked)}
            />
          </th>
          <th style={{ padding: "12px", width: "60px", textAlign: "center" }}>
            #
          </th>

          {columns.map((column) => (
            <th
              key={column.key}
              style={{
                padding: "12px",
                width: column.width || "auto",
                textAlign: column.align || "left",
                cursor: column.sortable ? "pointer" : "default",
                borderBottom: "2px solid #dee2e6",
                fontWeight: 600,
                color: "#495057",
              }}
              onClick={() => column.sortable && this.handleSort(column.key)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    column.align === "center"
                      ? "center"
                      : column.align === "right"
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                {column.title}
                {column.sortable && (
                  <span style={{ marginLeft: "5px" }}>
                    {sortColumn === column.key
                      ? sortOrder === "asc"
                        ? "▲"
                        : "▼"
                      : "↕️"}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  renderTableBody() {
    const { columns } = this.props;
    const { data, selectedRows, currentPage, pageSize } = this.state;

    if (data.length === 0) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={columns.length + 2}
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#6c757d",
              }}
            >
              📦 Data မရှိပါ
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {data.map((item, index) => {
          const globalIndex = (currentPage - 1) * pageSize + index + 1;
          const isSelected = selectedRows.includes(item.id);

          return (
            <tr
              key={item.id}
              style={{
                backgroundColor: isSelected
                  ? "#e3f2fd"
                  : index % 2 === 0
                  ? "#fff"
                  : "#f8f9fa",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? "#fff" : "#f8f9fa";
                }
              }}
            >
              <td style={{ padding: "12px", textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) =>
                    this.handleRowSelect(item.id, e.target.checked)
                  }
                />
              </td>

              <td
                style={{
                  padding: "12px",
                  textAlign: "center",
                  color: "#6c757d",
                }}
              >
                {globalIndex}
              </td>

              {columns.map((column) => {
                const value = (item as any)[column.key];
                return (
                  <td
                    key={column.key}
                    style={{
                      padding: "12px",
                      textAlign: column.align || "left",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    {column.render ? column.render(value, item, index) : value}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  }

  renderSearchBar() {
    const { showSearch = true } = this.props;
    const { searchQuery } = this.state;

    if (!showSearch) return null;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="🔍 Product တွေ ရှာကြည့်ပါ..."
            value={searchQuery}
            onChange={(e) => this.handleSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 40px 10px 15px",
              border: "2px solid #e9ecef",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#007bff";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e9ecef";
            }}
          />
          {searchQuery && (
            <button
              onClick={() => this.handleSearch("")}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }

  renderPagination() {
    const { showPagination = true } = this.props;
    const { currentPage, pageSize, total } = this.state;

    if (!showPagination || total === 0) return null;

    const totalPages = Math.ceil(total / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, total);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          padding: "15px 0",
          borderTop: "1px solid #dee2e6",
        }}
      >
        <div style={{ color: "#6c757d", fontSize: "14px" }}>
          {startItem}-{endItem} of {total} items စုစုပေါင်း
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <select
            value={pageSize}
            onChange={(e) => this.handlePageSizeChange(Number(e.target.value))}
            style={{
              padding: "5px 10px",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
            }}
          >
            <option value={5}>5 ခု</option>
            <option value={10}>10 ခု</option>
            <option value={20}>20 ခု</option>
            <option value={50}>50 ခု</option>
          </select>

          <div style={{ display: "flex", gap: "5px" }}>
            <button
              disabled={currentPage === 1}
              onClick={() => this.handlePageChange(currentPage - 1)}
              style={{
                padding: "8px 12px",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                backgroundColor: currentPage === 1 ? "#f8f9fa" : "#fff",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              ⬅️ ရှေ့
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => this.handlePageChange(page)}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    backgroundColor: page === currentPage ? "#007bff" : "#fff",
                    color: page === currentPage ? "white" : "#333",
                    cursor: "pointer",
                  }}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => this.handlePageChange(currentPage + 1)}
              style={{
                padding: "8px 12px",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                backgroundColor:
                  currentPage === totalPages ? "#f8f9fa" : "#fff",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              နောက် ➡️
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { title = "Data Table", columns } = this.props;
    const { loading, error, selectedRows } = this.state;

    if (error) {
      return (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            border: "1px solid #f8d7da",
            borderRadius: "8px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
          }}
        >
          <h3>❌ Error ဖြစ်နေပါသည်</h3>
          <p>{error}</p>
          <button
            onClick={this.fetchData}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🔄 ပြန်ကြိုးစားမည်
          </button>
        </div>
      );
    }

    return (
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #dee2e6",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h2 style={{ margin: 0, color: "#495057" }}>{title}</h2>
            {selectedRows.length > 0 && (
              <div
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                ✅ {selectedRows.length} ခု ရွေးချယ်ထားသည်
              </div>
            )}
          </div>
          {this.renderSearchBar()}
        </div>

        {/* Table Content */}
        <div style={{ position: "relative" }}>
          {loading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <LoadingService type="spinner" message="Data ရယူနေပါသည်..." />
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              {this.renderTableHeader()}
              {this.renderTableBody()}
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "0 20px 20px" }}>{this.renderPagination()}</div>
      </div>
    );
  }

  componentWillUnmount() {
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId);
    }
  }
}
