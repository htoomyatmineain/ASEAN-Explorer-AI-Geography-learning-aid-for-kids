% backend/prolog/features/explain_mode/routes.pl
% HTTP routes for Feature 6 — Why Is This the Answer?

:- http_handler(root(explain/neighbor), handle_explain_neighbor, [method(get)]).
:- http_handler(root(explain/membership), handle_explain_membership, [method(get)]).

% GET /explain/neighbor?a=myanmar&b=thailand
handle_explain_neighbor(Request) :-
    cors_enable,
    http_parameters(Request, [ a(AStr, []), b(BStr, []) ]),
    atom_string(A, AStr),
    atom_string(B, BStr),
    explain_neighbor(A, B, Explanation),
    reply_json_dict(_{ explanation: Explanation }).

% GET /explain/membership?country=singapore
handle_explain_membership(Request) :-
    cors_enable,
    http_parameters(Request, [ country(CStr, []) ]),
    atom_string(Country, CStr),
    explain_membership(Country, Explanation),
    reply_json_dict(_{ explanation: Explanation }).
