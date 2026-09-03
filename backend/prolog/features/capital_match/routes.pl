% backend/prolog/features/capital_match/routes.pl
% HTTP route for Feature 5 — Match the Capitals.

:- http_handler(root(capital_match), handle_capital_match, [method(post)]).

% POST /capital_match
% Body: { "country": "vietnam", "guessed_city": "hanoi" }
handle_capital_match(Request) :-
    cors_enable,
    http_read_json_dict(Request, Body),
    atom_string(Country, Body.get(country)),
    atom_string(GuessedCity, Body.get(guessed_city)),
    check_capital_match(Country, GuessedCity, Result),
    reply_json_dict(_{ country: Country, guessed_city: GuessedCity, result: Result }).
