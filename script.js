(() => {
const boxAddressCalculatorForm = document.forms.namedItem("box-address-calculator-form");
const gamePresetSelect = boxAddressCalculatorForm.elements.namedItem("preset");
const baseAddressInput = boxAddressCalculatorForm.elements.namedItem("base-address");
const baseAddressOffsetStartInput =
	boxAddressCalculatorForm.elements.namedItem("base-address-shift-start");
const baseAddressOffsetEndInput =
	boxAddressCalculatorForm.elements.namedItem("base-address-shift-end");
const resultAddressOutput = boxAddressCalculatorForm.elements.namedItem("box-address");
const GAME_PRESETS = {
	"RS-J": {  // Japanese Ruby and Sapphire
		"base-address": 0x202fdbc,
		"base-address-shift-start": 0,
		"base-address-shift-end": 0,
	},
	"RS-EFIDS": {  // International Ruby and Sapphire
		"base-address": 0x20300a0,
		"base-address-shift-start": 0,
		"base-address-shift-end": 0,
	},
	"FRLG-J": {  // Japanese FireRed and LeafGreen
		"base-address": 0x202924c,
		"base-address-shift-start": 0,
		"base-address-shift-end": 124,
	},
	"FRLG-EFIDS": {  // International FireRed and LeafGreen
		"base-address": 0x2029314,
		"base-address-shift-start": 0,
		"base-address-shift-end": 124,
	},
	"EM-J": {  // Japanese Emerald
		"base-address": 0x20294ac,
		"base-address-shift-start": 0,
		"base-address-shift-end": 124,
	},
	"EM-EFIDS": {  // International Emerald
		"base-address": 0x2029808,
		"base-address-shift-start": 0,
		"base-address-shift-end": 124,
	},
	"CUSTOM": {
		"base-address": 0,
		"base-address-shift-start": 0,
		"base-address-shift-end": 0,
	},
};
const TOTAL_BOX_SLOTS = 30;
const BOX_POKEMON_SIZE = 80;

function setParemetersFromPreset(gamePreset) {
	const gamePresetValues = GAME_PRESETS[gamePreset];
	console.log(gamePresetValues);
	baseAddressInput.value = "0x" + gamePresetValues["base-address"].toString(16);
	baseAddressOffsetStartInput.value =
		gamePresetValues["base-address-shift-start"];
	baseAddressOffsetEndInput.value =
		gamePresetValues["base-address-shift-end"];
	// Ruby and Sapphire do not have an implementation of ASLR that is
	// present in other generation III games. They are disabled to more
	// closely match what happens in those games.
	// Users can set the "Custom" preset if they want to "simulate" ASLR
	// with Ruby and Sapphire addresses.
	if (gamePreset.startsWith("RS")) {
		baseAddressOffsetStartInput.setAttribute("readonly", "readonly");
		baseAddressOffsetEndInput.setAttribute("readonly", "readonly");
	}
	else {
		baseAddressOffsetStartInput.removeAttribute("readonly");
		baseAddressOffsetEndInput.removeAttribute("readonly");
	}
	// There is not a good reason to allow setting a custom base address
	// for the other game presets, as that is not what the base addresses
	// are in the actual games. However a "Custom" option has been provided
	// for more novel uses of this calculator and ROM hacks which may have
	// a different RAM address for gPokemonStorage.
	if (gamePreset === "CUSTOM")
		baseAddressInput.removeAttribute("readonly");
	else
		baseAddressInput.setAttribute("readonly", "readonly");
	resultAddressOutput.innerText = "";
}

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
		* BOX_POKEMON_SIZE + slotOffset;
	return [baseAddressStart + distance, baseAddressEnd + distance];
}

function formatHexResultAddress(resultAddress) {
	// While this is technically not the proper way to represent negative
	// hexadecimal addresses, it is slightly easier to read if using a
	// negative custom base address (use case might be for calculating
	// SUB/SBC offset for box name codes).
	return (resultAddress < 0 ? "−" : "") + "0x" + Math.abs(resultAddress).toString(16);
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

	let resultOutput = formatHexResultAddress(result[0]);
	if (result[0] !== result[1])
		resultOutput += " to " + formatHexResultAddress(result[1]);
	resultAddressOutput.innerText = resultOutput;
}

gamePresetSelect.addEventListener("input", (event) => {
	setParemetersFromPreset(event.target.value);
});

boxAddressCalculatorForm
	.addEventListener("submit", handleBoxAddressCalculatorFormSubmit);

boxAddressCalculatorForm
	.elements
	.namedItem("base-address")
	.addEventListener("input", (event) => {
		if (isNaN(Number(event.target.value)))
			event.target.setCustomValidity("Invalid base address.");
		else
			event.target.setCustomValidity("")
	});

boxAddressCalculatorForm
	.elements
	.namedItem("slot-offset")
	.addEventListener("input", (event) => {
		if (isNaN(Number(event.target.value)))
			event.target.setCustomValidity("Invalid slot offset.");
		else
			event.target.setCustomValidity("")
	});

baseAddressOffsetStartInput.addEventListener("input", (event) => {
	const offsetEnd = Number(baseAddressOffsetEndInput.value);
	if (Number(event.target.value) > offsetEnd)
		baseAddressOffsetEndInput.value = Number(event.target.value);
});

baseAddressOffsetEndInput.addEventListener("input", (event) => {
	const offsetStart = Number(baseAddressOffsetStartInput.value);
	if (Number(event.target.value) < offsetStart)
		baseAddressOffsetStartInput.value = Number(event.target.value);
});

document.addEventListener("DOMContentLoaded", () => {
	setParemetersFromPreset(gamePresetSelect.value);
});
})();
