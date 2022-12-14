import {useState} from "react";

const useIncrement = () => {
	const [count, setCount] = useState(0);

	const increment = () => setCount(c => c + 1);

	return { count, increment };
}

export default useIncrement;

