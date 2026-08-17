% backend/prolog/features/explain_mode/rules.pl
% Feature 6 — Why Is This the Answer? (§4.6 of docs/01-asean-explorer-prolog-kb.md)
% Owned by Person 5 (docs/03). Called from inside other features' UI, not a
% standalone screen — see docs/04-asean-explorer-features.md §6.

% explain_neighbor(+A, +B, -Explanation) gives a plain-language reason,
% not just yes/no — this is what makes the app feel like real AI reasoning.
explain_neighbor(A, B, Explanation) :-
    neighbor(A, B), !,
    format(atom(Explanation),
           'Yes. ~w and ~w are neighboring countries because they share a border.',
           [A, B]).
explain_neighbor(A, B, Explanation) :-
    format(atom(Explanation),
           'No. ~w and ~w do not share a border, so they are not neighboring countries.',
           [A, B]).

% explain_membership(+Country, -Explanation)
explain_membership(Country, Explanation) :-
    asean_country(Country), !,
    format(atom(Explanation), '~w is a member of ASEAN.', [Country]).
explain_membership(Country, Explanation) :-
    format(atom(Explanation), '~w is not a member of ASEAN.', [Country]).
