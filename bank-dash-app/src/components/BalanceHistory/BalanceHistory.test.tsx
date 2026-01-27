import { render } from "@testing-library/react";
import { BalanceHistory } from "./BalanceHistory";

describe("BalanceHistory", () => {
  it("renders BalanceHistory chart", () => {
    const { container } = render(
      <div style={{ width: 600, height: 300 }}>
        <BalanceHistory />
      </div>,
    );

    // Recharts renders an SVG element for the chart
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();

    // Ensure gradient definition is present
    const gradient = container.querySelector("linearGradient#balanceGradient");
    expect(gradient).toBeInTheDocument();
  });
});
