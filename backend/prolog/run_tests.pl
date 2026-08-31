<<<<<<< HEAD
% ============================================================
% run_tests.pl — verification for the Person 4 sector
%
% Usage:  swipl -g "[run_tests]"
%   (or on this machine: "C:\Program Files\swipl\bin\swipl.exe" -g "[run_tests]")
%
% Writes output.txt with the result of every query proof, in the
% same style as Person 1's verified-query proofs in
% INTEGRATION_NOTES.md §1.
% ============================================================

=======
>>>>>>> origin/dev
:- [kb].

run_tests :-
    open('output.txt', write, S),
<<<<<<< HEAD

    writeln(S, '=== Person 4 sector — shared KB sanity ==='),

    writeln(S, ''),
    writeln(S, '1. asean_country(thailand).'),
    (   asean_country(thailand) -> writeln(S, true) ; writeln(S, false) ),

    writeln(S, '2. findall(X, neighbor(myanmar, X), N) — expect no duplicates from facts:'),
    findall(X, neighbor(myanmar, X), Raw),
    writeln(S, Raw),

    writeln(S, ''),
    writeln(S, '=== Feature 4 — Who Is My Neighbor? (rules.pl, KB doc 4.4) ==='),

    writeln(S, ''),
    writeln(S, '3. find_non_neighbors(myanmar, [china, india, bangladesh, thailand, laos, vietnam], X).'),
    writeln(S, '   KB doc 5.3 expects X = [vietnam]'),
    find_non_neighbors(myanmar, [china, india, bangladesh, thailand, laos, vietnam], X3),
    writeln(S, X3),

    writeln(S, '4. neighbors_of(myanmar, N).'),
    writeln(S, '   KB doc 5.3 expects N = [thailand, laos, china, india, bangladesh]'),
    neighbors_of(myanmar, N4),
    writeln(S, N4),

    writeln(S, '5. is_real_neighbor(myanmar, thailand). — expect true'),
    (   is_real_neighbor(myanmar, thailand) -> writeln(S, true) ; writeln(S, false) ),

    writeln(S, '6. is_real_neighbor(myanmar, vietnam). — expect false'),
    (   is_real_neighbor(myanmar, vietnam) -> writeln(S, true) ; writeln(S, false) ),

    writeln(S, '7. find_non_neighbors(singapore, [thailand, vietnam, indonesia], X). — expect all three (Singapore has no land borders)'),
    find_non_neighbors(singapore, [thailand, vietnam, indonesia], X7),
    writeln(S, X7),

    writeln(S, '8. find_non_neighbors(brunei, [malaysia, indonesia, thailand], X). — expect [thailand]'),
    find_non_neighbors(brunei, [malaysia, indonesia, thailand], X8),
    writeln(S, X8),

    writeln(S, ''),
    writeln(S, '=== Feature 5 — Match the Capitals (rules.pl, KB doc 4.5) ==='),

    writeln(S, ''),
    writeln(S, '9. check_capital_match(vietnam, hanoi, R). — expect R = correct'),
    check_capital_match(vietnam, hanoi, R9),
    writeln(S, R9),

    writeln(S, '10. check_capital_match(vietnam, manila, R). — expect R = incorrect'),
    check_capital_match(vietnam, manila, R10),
    writeln(S, R10),

    writeln(S, '11. check_capital_match(cambodia, phnom_penh, R). — expect R = correct'),
    check_capital_match(cambodia, phnom_penh, R11),
    writeln(S, R11),

    writeln(S, '12. check_capital_match(brunei, kuala_lumpur, R). — expect R = incorrect'),
    check_capital_match(brunei, kuala_lumpur, R12),
    writeln(S, R12),

    writeln(S, '13. findall(C, country(C), Cs), length(Cs, N). — expect N = 10 ASEAN countries'),
    findall(C, country(C), Cs13), length(Cs13, N13),
    writeln(S, N13),

    writeln(S, ''),
    writeln(S, '=== done ==='),

=======
    
    writeln(S, '1. asean_country(thailand).'),
    (asean_country(thailand) -> writeln(S, true) ; writeln(S, false)),
    
    writeln(S, '2. asean_country(china).'),
    (asean_country(china) -> writeln(S, true) ; writeln(S, false)),
    
    writeln(S, '3. capital(vietnam, C), writeln(C).'),
    (capital(vietnam, C) -> writeln(S, C) ; writeln(S, 'failed')),
    
    writeln(S, '4. neighbor(myanmar, X), writeln(X).'),
    findall(X, neighbor(myanmar, X), Neighbors),
    (Neighbors \= [] -> writeln(S, Neighbors) ; writeln(S, 'failed')),
    
    writeln(S, '5. is_landlocked(laos).'),
    (is_landlocked(laos) -> writeln(S, true) ; writeln(S, false)),
    
    writeln(S, '6. same_subregion(thailand, vietnam).'),
    (same_subregion(thailand, vietnam) -> writeln(S, true) ; writeln(S, false)),
    
    writeln(S, '7. same_subregion(thailand, singapore).'),
    (same_subregion(thailand, singapore) -> writeln(S, true) ; writeln(S, false)),
    
    writeln(S, '8. findall(C, country(C), Cs), length(Cs, N), writeln(N).'),
    findall(C_country, country(C_country), Cs), length(Cs, N), writeln(S, N),
    
>>>>>>> origin/dev
    close(S),
    halt.
