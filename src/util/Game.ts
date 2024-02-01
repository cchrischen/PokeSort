import * as pokemons from "./Pokemon.json";
import * as typeMatchups from "./Types.json";

import { rng, shuffle, sortByKey } from "./util";

type PokeData = {
  dex: number;
  generation: number;
  name: string;
  type: string[];
  stats: number[];
  sprite: string;
  variants?: number;
};

export const pokemonData = (pokemons as any).default;
const typeData = typeMatchups as any;

export const gameCategories = [
  {
    title: "National Dex",
    info: "Order the species such that their corresponding national dex numbers are non-decreasing. The dex number of regional variants and gimmick forms (Mega/Gmax) are the dex number of their base form.",
    id: 0,
  },
  {
    title: "Base Stat",
    info: "Order the Pokemon such that their corresponding base stat values listed above are non-decreasing.",
    id: 1,
  },
  {
    title: "Supereffective Chain",
    info: "Order the Pokemon such that a move of at least one type of the current Pokemon is supereffective against the next Pokemon. Ignore abilities.",
    id: 2,
  },
  {
    title: "Species Name Chain",
    info: "Order the Pokemon such that the last letter of a Pokemon species is the first letter of the next.",
    id: 3,
  },
];

export const statChoices = [
  "HP",
  "Attack",
  "Defense",
  "Special Attack",
  "Special Defense",
  "Speed",
  "Bast Stat Total",
];

const randomizeVariant = (num: number) => {
  const key = `${num}-0`;
  const data: PokeData = pokemonData[key];

  return !data.variants
    ? key
    : data.variants == 1
      ? key
      : `${num}-${rng(0, data.variants - 1)}`;
};

export const get6Pokemon = (control: number) => {
  const keys: { name: string }[] = [];

  for (let i = 0; i < 6; i++) {
    const num = rng(1, 1025);

    const newMon = randomizeVariant(num);

    if (keys.map((mon) => mon.name).includes(newMon)) {
      i--;
    } else {
      keys.push({ name: newMon });
    }
  }

  let soln: string[] = [];
  if (control == -1) {
    soln = sortByKey(pokemonData, keys, "dex");
  } else {
    soln = sortByKey(pokemonData, keys, control);
  }

  return [soln, keys];
};

const keyToEffectiveness = (key: string): number => {
  return key == "double_damage_from" ? 2 : key == "half_damage_from" ? 0.5 : 0;
};

const findWeaknesses = (defendingTypes: string[]) => {
  const effectiveness: { [key: string]: number } = {};
  Object.keys(typeData).forEach((type) => (effectiveness[type] = 1));

  defendingTypes.forEach((dType) => {
    const matchup = typeData[dType];

    Object.keys(matchup)
      .filter((key) => key.includes("from"))
      .forEach((key) =>
        matchup[key].forEach(
          (type: string) => (effectiveness[type] *= keyToEffectiveness(key))
        )
      );
  });

  return Object.keys(effectiveness).filter((key) => effectiveness[key] > 1);
};

export const getTypeChain = () => {
  const keys: string[] = [];

  let lastTypes: string[] = [];

  for (let i = 0; i < 6; i++) {
    let newKey: string = "";
    if (lastTypes.length == 0) {
      const num = rng(1, 1025);
      const newMon = randomizeVariant(num);
      const monTypes = pokemonData[newMon].types;

      newKey = newMon;
      lastTypes = monTypes;
    } else {
      const weaknesses = findWeaknesses(lastTypes);
      const hasType = Object.keys(pokemonData).filter((key) =>
        pokemonData[key].types.some((type: string) => weaknesses.includes(type))
      );

      const num = rng(0, hasType.length - 1);
      newKey = hasType[num];
      lastTypes = pokemonData[newKey].types;
    }

    keys.push(newKey);
  }

  return [
    keys.reverse(),
    shuffle(
      keys.map((key) => {
        return { name: key };
      })
    ),
  ];
};

export const getSpeciesName = (data: PokeData) => {
  const ignore = [
    413, 641, 642, 645, 681, 710, 711, 741, 745, 746, 849, 892, 905,
  ];
  const name = data.name;

  return ignore.includes(data.dex)
    ? name.substring(0, name.indexOf("-"))
    : name;
};

export const getNameChain = () => {
  const keys: string[] = [];

  let last = "";
  for (let i = 0; i < 6; i++) {
    let newKey: string = "";
    let name: string = "";
    if (last == "") {
      const num = rng(1, 1025);
      name = getSpeciesName(pokemonData[num + "-0"]);
      newKey = num + "-0";
    } else {
      const startWithLast = Object.keys(pokemonData)
        .filter((key) => key.includes("-0"))
        .map((key) => pokemonData[key])
        .filter((pkm) => pkm.name.substring(0, 1) == last);

      const num = rng(0, startWithLast.length - 1);
      name = getSpeciesName(startWithLast[num]);
      newKey = startWithLast[num].dex + "-0";
    }

    last = name.substring(name.length - 1);

    if (keys.includes(newKey)) {
      i--;
    } else {
      keys.push(newKey);
    }
  }

  return [
    keys,
    shuffle(
      keys.map((key) => {
        return { name: key };
      })
    ),
  ];
};

export const generateGame = () => {
  const category = rng(1, gameCategories.length);
};

export const checkWin = (
  answers: { name: string }[],
  category: number,
  stat: number
) => {
  const names: string[] = [];
  answers.forEach((answer) => names.push(answer.name));

  for (let i = 1; i < names.length; i++) {
    if (!inOrder(names[i], names[i - 1], category, stat)) {
      return false;
    }
  }

  return true;
};

const inOrder = (
  currDex: string,
  prevDex: string,
  category: number,
  stat: number
) => {
  const prevMon = pokemonData[prevDex];
  const currMon = pokemonData[currDex];

  if (category == 0) {
    return currMon.dex >= prevMon.dex;
  } else if (category == 1) {
    return currMon.stats[stat] >= prevMon.stats[stat];
  } else if (category == 2) {
    const weaknesses = findWeaknesses(currMon.types);
    return prevMon.types.some((type: string) => weaknesses.includes(type));
  } else {
    const currSpecies = getSpeciesName(currMon);
    const prevSpecies = getSpeciesName(prevMon);

    return currSpecies[0] == prevSpecies[prevSpecies.length - 1];
  }
};
