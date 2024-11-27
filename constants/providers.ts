import { ProviderDetails } from "@core/types/types";

const setProvider = ({
	name,
	idName = name,
	importedFrom = idName,
}: {
	name: string;
	idName?: string;
	importedFrom?: string;
}): ProviderDetails => ({
	providerName: name,
	providerIdName: idName,
	importedFrom: importedFrom,
});

export const Providers = {
	gamdomOriginals: setProvider({
		name: "Gamdom Originals",
		idName: "ours",
		importedFrom: "ours",
	}),
	softswiss: setProvider({
		name: "Softswiss",
		idName: "acceptance",
		importedFrom: "softswiss",
	}),
	pragmaticPlayLive: setProvider({
		name: "Pragmatic Play Live",
		importedFrom: "pragmaticplay",
	}),
	original: setProvider({
		name: "Original",
		idName: "softswiss",
		importedFrom: "softswiss",
	}),
	bgaming: setProvider({
		name: "Bgaming",
		idName: "softswiss",
		importedFrom: "softswiss",
	}),
	vave: setProvider({
		name: "Vave",
		idName: "softswiss",
		importedFrom: "softswiss",
	}),
	pragmaticPlay: setProvider({
		name: "Pragmatic Play",
		importedFrom: "pragmaticplay",
	}),
	oddin: setProvider({ name: "oddin" }),
	hacksawGaming: setProvider({
		name: "Hacksaw Gaming",
		idName: "hacksaw",
		importedFrom: "hacksawgaming",
	}),
	kalamba: setProvider({ name: "Kalamba", importedFrom: "hub88" }),
} as const;
