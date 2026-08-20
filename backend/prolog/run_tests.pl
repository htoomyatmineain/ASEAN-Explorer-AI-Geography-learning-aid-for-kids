:- [kb].

run_tests :-
    open('output.txt', write, S),
    
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
    
    close(S),
    halt.
