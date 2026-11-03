% backend/prolog/features/capital_match/routes.pl
% HTTP route for Feature 5 — Match the Capitals.

:- http_handler(root(capital_match), handle_capital_match, []).

% POST /capital_match
% Body: { "country": "vietnam", "guessed_city": "hanoi" }

% Browsers preflight cross-origin POSTs with an OPTIONS request. Without this
% branch http_dispatch would answer 405 with no CORS headers and the browser
% would block the real POST entirely (verified against the React dev server).
% Pattern from library(http/http_cors) — cors_enable/2 also writes the
% Access-Control-Allow-Origin header itself.
handle_capital_match(Request) :-
    option(method(options), Request), !,
    cors_enable(Request, [ methods([post]) ]),
    format('~n').

handle_capital_match(Request) :-
    cors_enable,
    http_read_json_dict(Request, Body),
    atom_string(Country, Body.get(country)),
    atom_string(GuessedCity, Body.get(guessed_city)),
    check_capital_match(Country, GuessedCity, Result),
    reply_json_dict(_{ country: Country, guessed_city: GuessedCity, result: Result }).
