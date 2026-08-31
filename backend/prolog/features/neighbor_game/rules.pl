% backend/prolog/features/neighbor_game/rules.pl
% Feature 4 — Who Is My Neighbor? (§4.4 of docs/01-asean-explorer-prolog-kb.md)
% Owned by Person 4 (docs/03).

% find_non_neighbors(+Country, +Candidates, -NonNeighbors) picks out the
% candidate(s) that do NOT actually border Country — this is the
% "which one is NOT a neighbor?" answer key.
find_non_neighbors(Country, Candidates, NonNeighbors) :-
    findall(X, (member(X, Candidates), \+ neighbor(Country, X)), NonNeighbors).

% is_real_neighbor(+Country, +Candidate) — simple yes/no check for a single option
is_real_neighbor(Country, Candidate) :-
    neighbor(Country, Candidate).
