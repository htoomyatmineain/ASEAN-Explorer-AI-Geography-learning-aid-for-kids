% backend/prolog/features/neighbor_game/routes.pl
% HTTP route for Feature 4 — Who Is My Neighbor?

:- http_handler(root(neighbor_check), handle_neighbor_check, [method(post)]).

% POST /neighbor_check
% Body: { "country": "myanmar", "candidates": ["china", "india", "bangladesh",
%                                               "thailand", "laos", "vietnam"] }
handle_neighbor_check(Request) :-
    cors_enable,
    http_read_json_dict(Request, Body),
    atom_string(Country, Body.get(country)),
    maplist([S,A]>>atom_string(A,S), Body.get(candidates), Candidates),
    find_non_neighbors(Country, Candidates, NonNeighbors),
    reply_json_dict(_{ country: Country, non_neighbors: NonNeighbors }).
