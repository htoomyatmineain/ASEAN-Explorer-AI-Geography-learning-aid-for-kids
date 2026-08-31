:- [kb].

run_tests :-
    writeln('--- asean_country(thailand) ---'),
    (asean_country(thailand) -> writeln(true) ; writeln(false)),
    
    writeln('--- asean_country(china) ---'),
    (asean_country(china) -> writeln(true) ; writeln(false)),
    
    writeln('--- capital(vietnam, C) ---'),
    (capital(vietnam, C) -> writeln(C) ; writeln(false)),
    
    writeln('--- neighbor(myanmar, X) ---'),
    findall(X, neighbor(myanmar, X), Neighbors),
    (Neighbors \= [] -> maplist(writeln, Neighbors) ; writeln(false)),
    
    writeln('--- is_landlocked(laos) ---'),
    (is_landlocked(laos) -> writeln(true) ; writeln(false)),
    
    writeln('--- same_subregion(thailand, vietnam) ---'),
    (same_subregion(thailand, vietnam) -> writeln(true) ; writeln(false)),
    
    writeln('--- same_subregion(thailand, singapore) ---'),
    (same_subregion(thailand, singapore) -> writeln(true) ; writeln(false)),
    
    writeln('--- Count Facts ---'),
    findall(C, country(C), Cs), length(Cs, N), writeln(N),
    halt.
