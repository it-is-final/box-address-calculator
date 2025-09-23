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
	const baseAddressStart = baseAddress + baseAddressOffsetStart;
	const baseAddressEnd = baseAddress + baseAddressOffsetEnd;
	const distance =
		(TOTAL_BOX_SLOTS * (boxNumber - 1) + boxSlot)
		* BOX_POKEMON_SIZE
		+ slotOffset;
	return [
		baseAddressStart + distance,
		baseAddressEnd + distance,
	];
}

})();
