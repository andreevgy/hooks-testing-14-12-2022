import {render, screen} from "@testing-library/react";
import {click} from "@testing-library/user-event/dist/click";
import useIncrement from "./useIncrement";

const TestComponent = () => {
	const { count, increment } = useIncrement();

	return <div>
		<span data-testid="count">{count}</span>
		<button data-testid="button" onClick={increment}>увеличить</button>
	</div>
}

describe("useIncrement", () => {
	test("First render", () => {
		render(<TestComponent />);
		const counter = screen.getByTestId("count");
		expect(counter.textContent).toEqual("0");
	});
	test("Increments on increment", () => {
		render(<TestComponent />);
		const button = screen.getByTestId("button");
		click(button);
		const counter = screen.getByTestId("count");
		expect(counter.textContent).toEqual("1");
	})
});
