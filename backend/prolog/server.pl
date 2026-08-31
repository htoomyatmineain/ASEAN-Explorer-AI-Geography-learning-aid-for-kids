<<<<<<< HEAD
% ============================================================
% backend/prolog/server.pl — Person 4 sector HTTP server
%
% Implements the API contract from INTEGRATION_NOTES.md §4:
%   POST /neighbor_check   -> Feature 4 "Who Is My Neighbor?"   (implemented)
%   POST /capital_match    -> Feature 5 "Match the Capitals"    (implemented)
%   GET  /country/:name    -> Person 2's route (503 in this sector)
%   GET  /guess            -> Person 3's route (501 placeholder)
%
% How to run (Windows):
%   "C:\Program Files\swipl\bin\swipl.exe" -f server.pl -g start_server
%   (or just double-click start.bat in this folder)
% How to run (bash):
%   swipl -f server.pl -g start_server
% ============================================================

=======
>>>>>>> origin/dev
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_cors)).
<<<<<<< HEAD
:- use_module(library(option)).
=======
>>>>>>> origin/dev

:- set_setting(http:cors, [*]). % Allow CORS from any origin for development

:- [kb].

<<<<<<< HEAD
% ------------------------------------------------------------
% Route registration (API contract — INTEGRATION_NOTES.md §4).
% Handlers are registered without a method restriction so that
% CORS preflight (OPTIONS) requests reach the handler — browsers
% always preflight a cross-origin POST with Content-Type: json.
% ------------------------------------------------------------
:- http_handler(root(country/Name), handle_country(Name), []).
:- http_handler(root('guess'), guess_handler, []).
:- http_handler(root(neighbor_check), neighbor_check_handler, []).
:- http_handler(root(capital_match), capital_match_handler, []).

% Start the server on port 4000 (the port fixed by the contract).
start_server :-
    server(4000),
    format('ASEAN Explorer backend (Person 4 sector) running on http://localhost:4000~n'),
    format('Implemented routes: POST /neighbor_check, POST /capital_match~n'),
    format('Placeholder routes: GET /country/:name (Person 2), GET /guess (Person 3)~n~n').

server(Port) :-
    http_server(http_dispatch, [port(Port)]).

% ------------------------------------------------------------
% POST /neighbor_check — Feature 4 "Who Is My Neighbor?"
% Request:  { "country": "myanmar",
%             "candidates": ["thailand", "laos", "vietnam", "singapore"] }
% Response: { "country": "myanmar",
%             "non_neighbors": ["vietnam", "singapore"] }
% The non_neighbors list is the answer key computed by Prolog
% (find_non_neighbors/3, rules.pl) — the frontend never decides
% correctness on its own while the engine is reachable.
% ------------------------------------------------------------
neighbor_check_handler(Request) :-
    option(method(options), Request), !,
    cors_enable(Request, [methods([post])]),
    format('~n').                       % 200 with empty body (preflight)
neighbor_check_handler(Request) :-
    cors_enable,
    catch(
        (   http_read_json_dict(Request, Body),
            atom_string(Country, Body.get(country)),
            maplist([S, A]>>atom_string(A, S), Body.get(candidates), Candidates)
        ->  find_non_neighbors(Country, Candidates, NonNeighbors),
            reply_json_dict(_{ country: Country, non_neighbors: NonNeighbors })
        ;   reply_json_dict(_{ error: 'Expected JSON body { country, candidates }' },
                            [status(400)])
        ),
        error(_E, _Context),
        reply_json_dict(_{ error: 'Expected JSON body { country, candidates }' },
                        [status(400)])
    ).

% ------------------------------------------------------------
% POST /capital_match — Feature 5 "Match the Capitals"
% Request:  { "country": "vietnam", "guessed_city": "hanoi" }
% Response: { "country": "vietnam", "guessed_city": "hanoi",
%             "result": "correct" }
% Graded by check_capital_match/3 (rules.pl). Multi-word city names
% arrive underscored (e.g. "phnom_penh") to match the Prolog atoms.
% ------------------------------------------------------------
capital_match_handler(Request) :-
    option(method(options), Request), !,
    cors_enable(Request, [methods([post])]),
    format('~n').                       % 200 with empty body (preflight)
capital_match_handler(Request) :-
    cors_enable,
    catch(
        (   http_read_json_dict(Request, Body),
            atom_string(Country, Body.get(country)),
            atom_string(GuessedCity, Body.get(guessed_city))
        ->  check_capital_match(Country, GuessedCity, Result),
            reply_json_dict(_{ country: Country,
                               guessed_city: GuessedCity,
                               result: Result })
        ;   reply_json_dict(_{ error: 'Expected JSON body { country, guessed_city }' },
                            [status(400)])
        ),
        error(_E, _Context),
        reply_json_dict(_{ error: 'Expected JSON body { country, guessed_city }' },
                        [status(400)])
    ).

% ------------------------------------------------------------
% GET /country/:name — Person 2's route (explore_map feature).
% Kept so this sector slots into the team API surface unchanged.
% country_info/2 is not part of this sector, so the handler
% answers 503 exactly like the contract's "logic not available"
% state, and 404 once a later merge provides the predicate.
% ------------------------------------------------------------
handle_country(NameAtom, _Request) :-
    cors_enable,
    catch(
        (   country_info(NameAtom, card(NameAtom, Capital, Currency, Flag,
                                        Region, IsMember, Facts))
        ->  reply_json_dict(_{ country: NameAtom, capital: Capital,
                               currency: Currency, flag: Flag, region: Region,
                               asean_member: IsMember, famous_for: Facts })
        ;   reply_json_dict(_{ error: 'Country not found' }, [status(404)])
        ),
        error(existence_error(procedure, _), _),
        reply_json_dict(_{ error: 'Backend logic not yet available' }, [status(503)])
    ).

% ------------------------------------------------------------
% GET /guess — Person 3's route (guess_game feature). 501 stub
% per INTEGRATION_NOTES.md §4.
% ------------------------------------------------------------
guess_handler(_Request) :-
    cors_enable,
    reply_json_dict(_{ error: 'Not implemented' }, [status(501)]).
=======
% Routes
:- http_handler(root(country/Name), handle_country(Name), []).
:- http_handler(root('guess'), guess_handler, []).
:- http_handler(root('neighbor_check'), neighbor_check_handler, []).

% Start Server on port 4000
server(Port) :-
    http_server(http_dispatch, [port(Port)]).

start_server :-
    server(4000).

% /country/:name - Implemented
handle_country(NameAtom, _Request) :-
    cors_enable,
    catch(
        ( country_info(NameAtom, card(NameAtom, Capital, Currency, Flag, Region, IsMember, Facts)) ->
            reply_json_dict(_{ country: NameAtom, capital: Capital, currency: Currency,
                                flag: Flag, region: Region, asean_member: IsMember,
                                famous_for: Facts })
        ; reply_json_dict(_{ error: "Country not found" }, [status(404)])
        ),
        error(existence_error(procedure, _), _),
        reply_json_dict(_{ error: "Backend logic not yet available" }, [status(503)])
    ).

% /guess - Placeholder for teammates
guess_handler(_Request) :-
    cors_enable,
    reply_json_dict(_{error: "Not implemented"}, [status(501)]).

% /neighbor_check - Placeholder for teammates
neighbor_check_handler(_Request) :-
    cors_enable,
    reply_json_dict(_{error: "Not implemented"}, [status(501)]).
>>>>>>> origin/dev
