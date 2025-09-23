(() => {
const TOTAL_BOX_SLOTS = 30;
const BOX_POKEMON_SIZE = 80;

function calculateBoxAddress(
	baseAddress,
	baseAddressOffsetStart,
	baseAddressOffsetEnd,
	boxNumber,
	boxSlot,
	slotOffset,
) {
	const baseAddressStart = baseAddress + 4 + baseAddressOffsetStart;
	const baseAddressEnd = baseAddress + 4 + baseAddressOffsetEnd;
	const distance =
		(TOTAL_BOX_SLOTS * (boxNumber - 1) + (boxSlot - 1))
		* BOX_POKEMON_SIZE
		+ slotOffset;
	return [
		baseAddressStart + distance,
		baseAddressEnd + distance,
	];
}

function handleBoxAddressCalculatorFormSubmit(event) {
	event.preventDefault();

	const formData = new FormData(event.target);
	const baseAddress = Number(formData.get("base-address"));
	const baseAddressOffsetStart =
		Number(formData.get("base-address-shift-start"));
	const baseAddressOffsetEnd =
		Number(formData.get("base-address-shift-end"));
	const boxNumber = Number(formData.get("box-number"));
	const boxSlot = Number(formData.get("box-slot"));
	const slotOffset = Number(formData.get("slot-offset"));

	const result = calculateBoxAddress(
		baseAddress,
		baseAddressOffsetStart,
		baseAddressOffsetEnd,
		boxNumber,
		boxSlot,
		slotOffset,
	);

	const resultOutput = result[0] === result[1]
		? `0x${result[0].toString(16)}`
		: `0x${result[0].toString(16)} to 0x${result[1].toString(16)}`;
	event.target.querySelector("#box-address").innerText = resultOutput;
}

document
	.querySelector("#box-address-calculator-form")
	.addEventListener("submit", handleBoxAddressCalculatorFormSubmit);
})();
