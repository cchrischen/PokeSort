import * as pokemons from "./Pokemon.json";
import * as typeMatchups from "./Types.json"
import { rng, shuffle } from "./util";

type PokeData = {
    dex: number,
    generation: number,
    name: string,
    type: string[],
    stats: number[],
    sprite: string,
    variants?: number
}

const pokemonData = (pokemons as any).default;
const typeData = typeMatchups as any;

export const gameCategories = [
    {
        title: "Increasing Nationl Dex",
        desc: "Order the pokemon such that their corresponding national dex numbers increase",
        generate: 0
    },
    {
        title: "Increasing Base Stat",
        desc: "Order the pokemon such that their corresponding $ increase",
        generate: 0
    },
    {
        title: "Supereffective Chain",
        desc: "Order the pokemon such that a move of at least one type of the current pokemon is supereffective against the next pokemon",
        generate: 1
    },
    {
        title: "Name Chain",
        desc: "Order the pokemon such that the last letter of a pokemon is the first letter of the next",
        generate: 2
    }
]

export const statChoices = ["HP", "Attack", "Defense", "Special Attack", "Special Defense", "Speed", "Bast Stat Total"]

const randomizeVariant = (num:number) => {
    const key = `${num}-0`
    const data: PokeData = pokemonData[key];

    return !data.variants ? key :
        data.variants == 1 ? key :
        `${num}-${rng(0, data.variants - 1)}`;
}

export const get6Pokemon = () => {  
    const keys: {name: string}[] = []

    for (let i = 0; i < 6; i++) {
        const num = rng(1, 1025);
        
        const newMon = randomizeVariant(num);
        
        if (keys.map((mon) => mon.name).includes(newMon)) {
            i--;
        } else {
            keys.push({name: newMon});
        }
    }

    return keys;
}

const keyToEffectiveness = (key: string): number => {
    return key == "double_damage_from" ? 2 :
            key == "half_damage_from" ? 0.5 : 0;
}

const findWeaknesses = (defendingTypes: string[]) => {
    const effectiveness: {[key: string]: number} = {};
    Object.keys(typeData).forEach((type) => effectiveness[type] = 1);
    
    defendingTypes.forEach((dType) => {
        const matchup = typeData[dType];

        Object.keys(matchup).filter((key) => key.includes("from"))
        .forEach((key) => matchup[key].forEach((type:string) => effectiveness[type] *= keyToEffectiveness(key)));
    });

    return Object.keys(effectiveness).filter((key) => effectiveness[key] > 1);
}

export const getTypeChain = () => {
    const keys: string[] = [];

    let lastTypes: string[] = [];

    for (let i = 0; i < 2; i++) {
        
        let newKey: string = "";
        if (lastTypes.length == 0) {
            const num = rng(1, 1025);
            const newMon = randomizeVariant(num);
            const monTypes = pokemonData[newMon].types;
            
            newKey = newMon;
            lastTypes = monTypes;
            // console.log(pokemonData[newMon].name, pokemonData[newMon].types);
        } else {
            const weaknesses = findWeaknesses(lastTypes);
            const hasType = Object.keys(pokemonData).filter((key) => pokemonData[key].types
                            .some((type: string) => weaknesses.includes(type)));            

            const num = rng(0, hasType.length - 1);
            newKey = hasType[num];
            lastTypes = pokemonData[newKey].types;
        }

        keys.push(newKey);
    }

    console.log(keys.map((key) => pokemonData[key].name));
}

export const getSpeciesName = (data: PokeData) => {
    const ignore = [413, 641, 642, 645, 681, 710, 711, 741, 745, 746, 849, 892, 905]
    const name = data.name;

    return ignore.includes(data.dex) ? name.substring(0, name.indexOf("-")): name;
}

export const getNameChain = () => {
    const keys: string[] = [];

    let last = "";
    for (let i = 0; i < 6 ; i++) {
        
        let newKey: string = "";
        let name: string = "";
        if (last == "") {
            const num = rng(1, 1025);
            name = getSpeciesName(pokemonData[num + "-0"]);
            newKey = num + "-0"
        } else {
            const startWithLast = Object.keys(pokemonData).filter((key) => key.includes("-0"))
            .map((key) => pokemonData[key]).filter((pkm) => pkm.name.substring(0, 1) == last);    

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

    return shuffle(keys.map((key) => {
        return {name: key}
    }));
}

export const generateGame = () => {
    const category = rng(1, gameCategories.length);
}