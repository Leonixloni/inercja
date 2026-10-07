/**
 * Product progression definitions.
 * Keeping rewards and cross-topic links outside application logic makes
 * progression rules easy to audit and change independently.
 */

const MISJE = [
    { id: "pierwsza_lekcja", ikona: "🚀", nazwa: "Pierwszy krok", opis: "Ukończ pierwszą lekcję w dowolnym dziale.", nagroda: 1, typ: "postep" },
    { id: "trzy_lekcje", ikona: "📚", nazwa: "Trzy kroki naprzód", opis: "Ukończ 3 lekcje. Sprawdź różne podtematy, zamiast powtarzać tę samą lekcję.", nagroda: 2, typ: "postep" },
    { id: "sto_punktow", ikona: "🎯", nazwa: "Pierwsza setka", opis: "Zdobądź 100 punktów za poprawne odpowiedzi.", nagroda: 1, typ: "punkty" },
    { id: "seria_poprawnych", ikona: "🔥", nazwa: "Dobra seria", opis: "Odpowiedz poprawnie na 5 pytań z rzędu.", nagroda: 1, typ: "sesja" },
    { id: "youtube_subskrypcja", ikona: "▶️", nazwa: "Subskrybuj Inercję na YouTube", opis: "Zasubskrybuj kanał Inercji na YouTube. Po powrocie kliknij „Sprawdź subskrypcję”.", nagroda: 4, typ: "youtube" }
];

const POWIAZANE_OBSZARY = {
    mechanika: { statyka: ["statyka", "dynamika", "dynamika_i_statyka"], ruch_obrotowy: ["ruch_obrotowy", "dynamika_i_statyka"], grawitacja: ["grawitacja", "grawitacja_i_plyny"], mechanika_plynow: ["mechanika_plynow", "grawitacja_i_plyny"] },
    optyka: { przyrzady_optyczne: ["przyrzady_optyczne", "soczewki_i_przyrzady"], soczewki: ["soczewki", "soczewki_i_przyrzady"], optyka_falowa: ["optyka_falowa", "optyka_geometryczna"] },
    elektromagnetyzm: { prad: ["prad", "prad_i_obwody"], magnetyzm: ["magnetyzm", "magnetyzm_i_indukcja"], obwody_pradu: ["obwody_pradu", "prad_i_obwody"] },
    fale_drgania: { optyka_falowa: ["optyka_falowa", "fale_mechaniczne"], fale_elektromagnetyczne: ["fale_elektromagnetyczne", "optyka_falowa", "fale_mechaniczne"] },
    mechanika_kwantowa_jadrowa: { podstawy_kwantowe: ["podstawy_kwantowe", "kwanty"], fizyka_jadrowa: ["fizyka_jadrowa", "energia_jadrowa"], kwanty: ["kwanty", "podstawy_kwantowe"], energia_jadrowa: ["energia_jadrowa", "fizyka_jadrowa"] },
    teoria_wzglednosci: { szczegolna: ["szczegolna", "szczegolna_teoria_wzglednosci"], ogolna: ["ogolna", "ogolna_teoria_wzglednosci"] },
    fizyka_materialow: { struktury_krystaliczne: ["struktury_krystaliczne", "struktura_materii"], wlasciwosci: ["wlasciwosci", "wlasciwosci_materialow"] },
    termodynamika: { temperatura: ["temperatura", "temperatura_i_cieplo"], energia: ["energia", "przemiany_i_energia"], przemiany_gazowe: ["przemiany_gazowe", "przemiany_i_energia"] },
    astronomia: { ciala_niebieskie: ["ciala_niebieskie", "uklad_sloneczny"], ruchy_orbitalne: ["ruchy_orbitalne", "uklad_sloneczny"], uklad_sloneczny: ["uklad_sloneczny", "ruchy_orbitalne"], gwiazdy_i_galaktyki: ["gwiazdy_i_galaktyki", "obserwacje_i_kosmologia"], obserwacje_i_kosmologia: ["obserwacje_i_kosmologia", "gwiazdy_i_galaktyki"] }
};

export { MISJE, POWIAZANE_OBSZARY };
