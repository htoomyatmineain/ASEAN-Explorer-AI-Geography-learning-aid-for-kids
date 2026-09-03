% backend/prolog/features/guess_game/rules.pl
% Feature 3 — Guess the Country (§4.3 of docs/01-asean-explorer-prolog-kb.md)
% Owned by Person 3 (docs/03).

% A clue is one of: capital(City), member_of(asean), famous_for(Thing),
% borders(OtherCountry), language(Lang), currency(Cur), subregion(Region)
matches_clue(Country, capital(City))      :- capital(Country, City).
matches_clue(Country, member_of(asean))   :- asean_country(Country).
matches_clue(Country, famous_for(Thing))  :- famous_for(Country, Thing).
matches_clue(Country, borders(Other))     :- neighbor(Country, Other).
matches_clue(Country, language(Lang))     :- language(Country, Lang).
matches_clue(Country, currency(Cur))      :- currency(Country, Cur).
matches_clue(Country, subregion(Region))  :- subregion(Country, Region).

% guess_country(+Clues, -Country) finds the country consistent with EVERY clue
% An empty clue list is rejected rather than matching the first country/1 result.
guess_country(Clues, _Country) :-
    Clues == [],
    !,
    fail.
guess_country(Clues, Country) :-
    country(Country),
    forall(member(Clue, Clues), matches_clue(Country, Clue)).
