import { render, screen } from "@testing-library/react";
import { CreditCard } from "./CreditCard";

describe("CreditCard", () => {
  const props = {
    balance: "$5,756",
    cardHolder: "Eddy Cusuma",
    cardNumber: "3778 **** **** 1234",
    validThru: "12/22",
  };

  it("renders balance, holder, number and expiry", () => {
    render(<CreditCard {...props} />);

    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText(props.balance)).toBeInTheDocument();
    expect(screen.getByText("Card Holder")).toBeInTheDocument();
    expect(screen.getByText(props.cardHolder)).toBeInTheDocument();
    expect(screen.getByText("Valid Thru")).toBeInTheDocument();
    expect(screen.getByText(props.validThru)).toBeInTheDocument();

    // Card number is a prominent text element
    expect(screen.getByText(props.cardNumber)).toBeInTheDocument();
  });

  it("supports custom className for container adjustments", () => {
    render(<CreditCard {...props} className="ring-1" />);
    const balanceEl = screen.getByText(props.balance);
    expect(balanceEl).toBeInTheDocument();
  });
});
