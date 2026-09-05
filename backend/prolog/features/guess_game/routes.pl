% backend/prolog/features/guess_game/routes.pl
% HTTP route for Feature 3 — Guess the Country.

:- http_handler(root(guess), handle_guess, []).

% POST /guess
% Body: { "clues": [ {"type": "capital", "value": "bangkok"},
%                     {"type": "member_of", "value": "asean"},
%                     {"type": "famous_for", "value": "elephants"},
%                     {"type": "borders", "value": "myanmar"} ] }

% Browsers preflight cross-origin POSTs with an OPTIONS request. Without this
% branch http_dispatch would answer 405 with no CORS headers and the browser
% would block the real POST entirely (same pattern as neighbor_game/routes.pl,
% verified against the React dev server).
handle_guess(Request) :-
    option(method(options), Request), !,
    cors_enable(Request, [ methods([post]) ]),
    format('~n').

handle_guess(Request) :-
    cors_enable,
    http_read_json_dict(Request, Body),
    Clues = Body.get(clues),
    parse_clues(Clues, ParsedClues),
    ( guess_country(ParsedClues, Country) ->
        reply_json_dict(_{ answer: Country })
    ; reply_json_dict(_{ error: "no country matches those clues" }, [status(404)])
    ).

% parse_clues(+JsonClues, -PrologClues) turns each {"type": T, "value": V}
% dict sent by React into the matching Prolog clue term, e.g. capital(bangkok).
parse_clues([], []).
parse_clues([Json|Rest], [Clue|ParsedRest]) :-
    atom_string(Type, Json.get(type)),
    atom_string(Value, Json.get(value)),
    Clue =.. [Type, Value],
    parse_clues(Rest, ParsedRest).
