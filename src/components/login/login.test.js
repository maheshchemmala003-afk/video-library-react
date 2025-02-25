import { render, screen } from "@testing-library/react";
import { Login } from "./login";

//Test-case-1

test('Testing Login Title',()=>{
    render(<Login/>);

    var title = screen.getByTestId("title");

    expect(title).toHaveTextContent(/User Login/);

})

// Test Case-2

test('Forgot Password Link Test',()=>{
    render(<Login/>);

    var link = screen.getByText(/Forgot Password/);

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href','forgot-password');
})
