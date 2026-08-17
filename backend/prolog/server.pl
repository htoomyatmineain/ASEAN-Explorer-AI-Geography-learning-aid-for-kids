% backend/prolog/server.pl
% Starts the HTTP server and wires up every feature's routes.
% Run with: swipl backend/prolog/server.pl  → API live on http://localhost:4000

:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_cors)).   % allow the React dev server to call this API
:- use_module(library(yall)).             % lambda syntax ([X,Y]>>Goal) used in neighbor_game routes

:- [kb].   % facts.pl, core.pl, and every feature's rules.pl

% Each feature owns its own route file — adding a feature means adding one
% line here, not editing someone else's routes (docs/03 §2).
:- ['features/explore_map/routes'].
:- ['features/journey_mode/routes'].
:- ['features/guess_game/routes'].
:- ['features/neighbor_game/routes'].
:- ['features/capital_match/routes'].
:- ['features/explain_mode/routes'].
:- ['features/dashboard/routes'].

:- initialization(main).

main :-
    http_server(http_dispatch, [port(4000)]),
    format("ASEAN Explorer backend listening on http://localhost:4000~n").
