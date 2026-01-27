import { render, screen } from "@testing-library/react";
import { RecentTransactions } from "./RecentTransactions";

describe("RecentTransactions", () => {
  it("renders a list of transactions with titles, dates, and amounts", () => {
    render(<RecentTransactions />);

    // Titles
    expect(screen.getByText("Deposit from my Card")).toBeInTheDocument();
    expect(screen.getByText("Deposit Paypal")).toBeInTheDocument();
    expect(screen.getByText("Jemi Wilson")).toBeInTheDocument();

    // Dates
    expect(screen.getByText("28 January 2021")).toBeInTheDocument();
    expect(screen.getByText("25 January 2021")).toBeInTheDocument();
    expect(screen.getByText("21 January 2021")).toBeInTheDocument();

    // Amounts (+/- formatting)
    expect(screen.getByText("-$850")).toBeInTheDocument();
    expect(screen.getByText("+$2,500")).toBeInTheDocument();
    expect(screen.getByText("+$5,400")).toBeInTheDocument();
  });
});
