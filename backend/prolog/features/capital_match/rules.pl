% backend/prolog/features/capital_match/rules.pl
% Feature 5 — Match the Capitals (§4.5 of docs/01-asean-explorer-prolog-kb.md)
% Owned by Person 4 (docs/03).

% check_capital_match(+Country, +GuessedCity, -Result) grades a drag-and-drop
% or tap-to-match answer.
% The cut (!) after the first clause stops Prolog from also trying the second
% clause on backtracking, which would otherwise hand the frontend "incorrect"
% right after already returning "correct".
check_capital_match(Country, GuessedCity, correct) :-
    capital(Country, GuessedCity), !.
check_capital_match(_Country, _GuessedCity, incorrect).
