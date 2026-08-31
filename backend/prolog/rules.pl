% ============================================================
% Person #4: Who Is My Neighbor + Match the Capitals
<<<<<<< HEAD
% Feature 4 (§4.4) and Feature 5 (§4.5) of
% docs/01-asean-explorer-prolog-kb.md
%
% Depends only on shared facts/core:
%   country/1, capital/2, borders/2, neighbor/2 (facts.pl)
%   asean_country/1 (core.pl)
% ============================================================

% ------------------------------------------------------------
% Feature 4 — "Who Is My Neighbor?" (§4.4)
% ------------------------------------------------------------

% find_non_neighbors(+Country, +Candidates, -NonNeighbors)
% Picks out the candidate(s) that do NOT actually border Country.
% This is the "which one is NOT a neighbor?" answer key used by
% POST /neighbor_check.
%
% Worked example (KB doc §5.3):
%   ?- find_non_neighbors(myanmar,
%          [china, india, bangladesh, thailand, laos, vietnam], X).
%   X = [vietnam].
find_non_neighbors(Country, Candidates, NonNeighbors) :-
    findall(X, (member(X, Candidates), \+ neighbor(Country, X)), NonNeighbors).

% is_real_neighbor(+Country, +Candidate)
% Simple yes/no check for a single option — used to grade one tap.
is_real_neighbor(Country, Candidate) :-
    neighbor(Country, Candidate).

% neighbors_of(+Country, -Neighbors)
% All countries that border Country, as a list.
% Worked example (KB doc §5.3):
%   ?- neighbors_of(myanmar, N).
%   N = [thailand, laos, china, india, bangladesh].
%
% neighbor/2 succeeds from both borders(A,B) and borders(B,A), and
% this sector's facts.pl lists each border in both directions, so a
% plain findall would list some neighbors twice. dedup/2 keeps the
% first occurrence of each, preserving the facts.pl order.
neighbors_of(Country, Neighbors) :-
    findall(N, neighbor(Country, N), Duplicated),
    dedup(Duplicated, Neighbors).

dedup([], []).
dedup([X|Xs], [X|Ys]) :-
    exclude(=(X), Xs, Rest),
    dedup(Rest, Ys).

% ------------------------------------------------------------
% Feature 5 — "Match the Capitals" (§4.5)
% ------------------------------------------------------------

% check_capital_match(+Country, +GuessedCity, -Result)
% Grades a tap-to-match answer. The cut (!) after the first clause
% stops Prolog from also trying the second clause on backtracking,
% which would otherwise hand the frontend "incorrect" right after
% already returning "correct".
%
% Worked examples (KB doc §5.4):
%   ?- check_capital_match(vietnam, hanoi, Result).  -> correct
%   ?- check_capital_match(vietnam, manila, Result). -> incorrect
check_capital_match(Country, GuessedCity, correct) :-
    capital(Country, GuessedCity), !.
check_capital_match(_Country, _GuessedCity, incorrect).
=======
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
>>>>>>> origin/dev
