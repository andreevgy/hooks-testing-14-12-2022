import {useEffect, useState} from "react";

let cache = {};

const useCachedRequest = (url) => {
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setData(null);
		if (cache[url]) {
			setData(cache[url]);
			setIsLoading(false);
		} else {
			setIsLoading(true);
			fetch(url)
				.then(res => res.json())
				.then(d => {
					setData(d);
					setIsLoading(false);
					cache[url] = d;
				});
		}
	}, [url]);

	return [isLoading, data];
}

export default useCachedRequest;
