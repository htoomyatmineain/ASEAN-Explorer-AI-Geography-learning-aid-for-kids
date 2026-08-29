% ============================================================
% Interactive Map Learning (§4.2 of docs/01-asean-explorer-prolog-kb.md)
% ============================================================

% country_info(+Country, -Card) builds the full pop-up card shown when a
% child taps a country on the interactive map.
country_info(Country, card(Country, Capital, Currency, FlagEmoji, Region, IsMember, Facts)) :-
    capital(Country, Capital),
    currency(Country, Currency),
    flag_emoji(Country, FlagEmoji),
    subregion(Country, Region),
    ( asean_country(Country) -> IsMember = yes ; IsMember = no ),
    findall(F, famous_for(Country, F), Facts).

% ============================================================
% Person #4: Who Is My Neighbor + Match the Capitals
% ============================================================

% find_non_neighbors/3
find_non_neighbors(_, [], []).
find_non_neighbors(Country, [C|Rest], NonNeighbors) :-
    (   neighbor(Country, C)
    ->  find_non_neighbors(Country, Rest, NonNeighbors)
    ;   NonNeighbors = [C|RestNon],
        find_non_neighbors(Country, Rest, RestNon)
    ).

% check_capital_match/3
check_capital_match(Country, Capital, correct) :-
    capital(Country, Capital).

check_capital_match(Country, Capital, incorrect) :-
    country(Country),
    capital(Country, _),
    \+ capital(Country, Capital).