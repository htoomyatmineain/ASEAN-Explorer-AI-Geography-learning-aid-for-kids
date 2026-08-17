% backend/prolog/features/guess_game/routes.pl
% HTTP route for Feature 3 — Guess the Country.

:- http_handler(root(guess), handle_guess, [method(post)]).

% POST /guess
% Body: { "clues": [ {"type": "capital", "value": "bangkok"},
%                     {"type": "member_of", "value": "asean"},
%                     {"type": "famous_for", "value": "elephants"},
%                     {"type": "borders", "value": "myanmar"} ] }
handle_guess(Request) :-
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
