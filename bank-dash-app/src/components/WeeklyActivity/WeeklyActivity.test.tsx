import { render } from "@testing-library/react";
import { WeeklyActivity } from "./WeeklyActivity";

describe("WeeklyActivity", () => {
  it("renders WeeklyActivity chart", () => {
    const { container, getByText } = render(
      <div style={{ width: 800, height: 400 }}>
        <WeeklyActivity />
      </div>,
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();

    // Legend text labels
    expect(getByText("Deposit")).toBeInTheDocument();
    expect(getByText("Withdraw")).toBeInTheDocument();
  });
});
