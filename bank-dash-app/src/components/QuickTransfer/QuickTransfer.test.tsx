import { render, screen } from "@testing-library/react";
import { QuickTransfer } from "./QuickTransfer";

describe("QuickTransfer", () => {
  it("renders contacts, input label, and send button", () => {
    render(<QuickTransfer />);

    // Static label
    expect(screen.getByText("Write Amount")).toBeInTheDocument();

    // Placeholder present
    expect(screen.getByPlaceholderText("525.50")).toBeInTheDocument();

    // Send button
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });
});
