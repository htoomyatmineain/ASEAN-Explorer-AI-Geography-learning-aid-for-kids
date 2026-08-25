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