<<<<<<< HEAD
﻿asean_country(Country) :- member(Country, [myanmar, thailand, laos, vietnam, cambodia, malaysia, singapore, indonesia, philippines, brunei]).
=======
% backend/prolog/core.pl
% Shared reasoning — §4.1 of docs/01-asean-explorer-prolog-kb.md
% Every feature's rules.pl builds on these; keep this file feature-agnostic.
% Owned by Person 1 (Core & Integration Lead, docs/03).

% Is Country an ASEAN member?
asean_country(Country) :-
    member_of(Country, asean).

capital_of(Country, City) :-
    capital(Country, City).

currency_of(Country, Currency) :-
    currency(Country, Currency).

% Borders are stored once in facts.pl; neighbor/2 makes the relationship symmetric.
% Clause 1 handles "Myanmar borders Thailand" being asked as neighbor(myanmar, X).
% Clause 2 handles the same fact being asked as neighbor(thailand, X).
neighbor(A, B) :- borders(A, B).
neighbor(A, B) :- borders(B, A).

neighbors_of(Country, Neighbors) :-
    findall(N, neighbor(Country, N), Neighbors).

% Only the neighbors that are also ASEAN members (filters out China, India, etc.)
asean_neighbors_of(Country, Neighbors) :-
    findall(N, (neighbor(Country, N), asean_country(N)), Neighbors).

same_subregion(A, B) :-
    subregion(A, Region),
    subregion(B, Region),
    A \== B.

is_landlocked(Country) :-
    landlocked(Country).
>>>>>>> origin/dev
