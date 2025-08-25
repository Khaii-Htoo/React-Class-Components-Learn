// components/LoadingService.tsx
import React, { Component } from "react";

interface LoadingProps {
  type?: "spinner" | "dots" | "bars" | "skeleton";
  size?: "small" | "medium" | "large";
  color?: string;
  message?: string;
  overlay?: boolean;
}

export class LoadingService extends Component<LoadingProps> {
  renderSpinner() {
    const { size = "medium", color = "#3498db" } = this.props;

    const sizeMap = {
      small: "20px",
      medium: "40px",
      large: "60px",
    };

    return (
      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          border: `3px solid #f3f3f3`,
          borderTop: `3px solid ${color}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
    );
  }

  renderDots() {
    const { color = "#3498db" } = this.props;

    return (
      <div style={{ display: "flex", gap: "5px" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: color,
              borderRadius: "50%",
              animation: `bounce 1.4s ease-in-out ${
                (i - 1) * 0.2
              }s infinite both`,
            }}
          />
        ))}
      </div>
    );
  }

  renderBars() {
    const { color = "#3498db" } = this.props;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "2px",
          height: "30px",
        }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              width: "6px",
              backgroundColor: color,
              animation: `bars 1.2s ease-in-out ${(i - 1) * 0.1}s infinite`,
            }}
          />
        ))}
      </div>
    );
  }

  renderSkeleton() {
    return (
      <div style={{ width: "100%" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: "20px",
              backgroundColor: "#f0f0f0",
              margin: "10px 0",
              borderRadius: "4px",
              animation: "skeleton 1.5s ease-in-out infinite alternate",
            }}
          />
        ))}
      </div>
    );
  }

  render() {
    const {
      type = "spinner",
      message = "ရှာနေပါသည်...",
      overlay = false,
    } = this.props;

    const loadingContent = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
          padding: "20px",
        }}
      >
        {type === "spinner" && this.renderSpinner()}
        {type === "dots" && this.renderDots()}
        {type === "bars" && this.renderBars()}
        {type === "skeleton" && this.renderSkeleton()}

        {type !== "skeleton" && message && (
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#666",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
      </div>
    );

    if (overlay) {
      return (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "30px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            {loadingContent}
          </div>
        </div>
      );
    }

    return loadingContent;
  }

  componentDidMount() {
    // Add CSS animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
      
      @keyframes bars {
        0%, 40%, 100% { transform: scaleY(0.4); }
        20% { transform: scaleY(1); }
      }
      
      @keyframes skeleton {
        0% { opacity: 0.6; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}
