% backend/prolog/features/neighbor_game/routes.pl
% HTTP route for Feature 4 — Who Is My Neighbor?

:- http_handler(root(neighbor_check), handle_neighbor_check, []).

% POST /neighbor_check
% Body: { "country": "myanmar", "candidates": ["china", "india", "bangladesh",
%                                               "thailand", "laos", "vietnam"] }

% Browsers preflight cross-origin POSTs with an OPTIONS request. Without this
% branch http_dispatch would answer 405 with no CORS headers and the browser
% would block the real POST entirely (verified against the React dev server).
% Pattern from library(http/http_cors) — cors_enable/2 also writes the
% Access-Control-Allow-Origin header itself.
handle_neighbor_check(Request) :-
    option(method(options), Request), !,
    cors_enable(Request, [ methods([post]) ]),
    format('~n').

handle_neighbor_check(Request) :-
    cors_enable,
    http_read_json_dict(Request, Body),
    atom_string(Country, Body.get(country)),
    maplist([S,A]>>atom_string(A,S), Body.get(candidates), Candidates),
    find_non_neighbors(Country, Candidates, NonNeighbors),
    reply_json_dict(_{ country: Country, non_neighbors: NonNeighbors }).
