:- initialization(main, main).
main :-
    catch(country_info(test, test), E, (writeln(E))),
    halt.
