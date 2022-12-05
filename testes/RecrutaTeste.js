import RecrutaProxy from "../src/index.js";

describe("Recruta", function () {
	/** @type {import("node:http").Server} */
	let Proxy;

	beforeAll(function () {
		Proxy = RecrutaProxy();
	});

	it("deve estar na escuta", function () {
		expect(Proxy.listening).toBeTrue();
	});
});
