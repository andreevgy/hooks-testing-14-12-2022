import useCachedRequest from "./useCachedRequest";
import {renderHook} from "@testing-library/react-hooks";

global.fetch = (url) => new Promise(res => {
	setTimeout(() => {
		res({
			json: () => new Promise(resolve => resolve({ url }))
		})
	}, 50);
});

/*
 Так как кэширование происходит в глобальном объекте, нам нужно генерировать рандомные url для каждого теста,
 чтобы они не влияли друг на друга
 */
const generateRandomUrl = () => `"https://google.com"/${(Math.random() + 1).toString(36).substring(7)}`

describe("useCachedRequest", () => {
	test("Initial call", () => {
		const url = generateRandomUrl();
		const { result } = renderHook(() => useCachedRequest(url));
		expect(result.current).toEqual([true, null]);
	});
	test("Changes status when request is finished first time", async () => {
		const url = generateRandomUrl();
		const { result, waitForNextUpdate } = renderHook(() => useCachedRequest(url));
		expect(result.current).toEqual([true, null]);
		await waitForNextUpdate();
		expect(result.current[0]).toEqual(false);
		expect(result.current[1]).not.toBeNull();
	});
	test("Expect to return cached result immediately if same request was already made", async () => {
		const url1 = generateRandomUrl();
		const url2 = generateRandomUrl();
		const { result, waitForNextUpdate, rerender } = renderHook(
			(props) => useCachedRequest(props.url),
			{ initialProps: { url: url1 } }
		);
		await waitForNextUpdate();
		expect(result.current[0]).toEqual(false);
		expect(result.current[1]).toEqual({ url: url1 });

		rerender({ url: url2 });
		expect(result.current).toEqual([true, null]);
		await waitForNextUpdate();
		expect(result.current[0]).toEqual(false);
		expect(result.current[1]).toEqual({ url: url2 });

		rerender({ url: url1 });
		expect(result.current).toEqual([false, { url: url1 }]);

		rerender({ url: url2 });
		expect(result.current).toEqual([false, { url: url2 }]);
	});
});
