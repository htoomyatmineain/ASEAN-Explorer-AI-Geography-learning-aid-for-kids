:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_cors)).
:- use_module(library(http/http_parameters)). % needed by features/explain_mode/routes.pl

% Windows' default new-stream encoding follows the system locale (not UTF-8),
% which matters for reading source files with non-ASCII literals (facts.pl
% also declares :- encoding(utf8) itself, since that's per-file).
:- set_prolog_flag(encoding, utf8).

:- set_setting(http:cors, [*]). % Allow CORS from any origin for development

:- [kb].

% /country/:name is small enough to keep here, since it's a thin wrapper
% around rules.pl's country_info/2. Every other feature owns its own
% routes.pl — server.pl just loads them (docs/02 §2.2), so adding a feature
% means adding one line here, not editing someone else's routes.
:- http_handler(root(country/Name), handle_country(Name), []).
:- [features/guess_game/routes].
:- [features/neighbor_game/routes].
:- [features/capital_match/routes].
:- [features/explain_mode/routes].
:- [features/dashboard/routes].
:- [features/journey_mode/routes].

% Start Server on port 4000
server(Port) :-
    http_server(http_dispatch, [port(Port)]).

start_server :-
    server(4000).

% json_unicode_escape(+Atom, -Escaped) renders Atom as a pure-ASCII JSON
% \uXXXX-escaped string body (no surrounding quotes), splitting characters
% above U+FFFF into a UTF-16 surrogate pair per the JSON spec.
%
% flag_emoji/2 values (e.g. '🇻🇳') go through this instead of straight to
% reply_json_dict: this SWI-Prolog Windows build corrupts astral (>U+FFFF)
% characters written through thread_httpd's per-connection socket stream —
% neither set_prolog_flag(encoding, utf8) nor a per-handler
% set_stream(current_output, encoding(utf8)) fixes it (verified: both still
% produced mangled bytes). \uXXXX escapes are plain ASCII, so they pass
% through untouched regardless of that bug, and every JSON parser
% (including the frontend's) decodes them back to the correct character.
json_unicode_escape(Atom, Escaped) :-
    atom_codes(Atom, Codes),
    foldl(json_escape_code_, Codes, '', Escaped).

json_escape_code_(Code, In, Out) :-
    ( Code =< 0xFFFF ->
        format(atom(A), '\\u~`0t~16r~4|', [Code])
    ;   Code0 is Code - 0x10000,
        Hi is 0xD800 + (Code0 >> 10),
        Lo is 0xDC00 + (Code0 /\ 0x3FF),
        format(atom(A), '\\u~`0t~16r~4|\\u~`0t~16r~4|', [Hi, Lo])
    ),
    atom_concat(In, A, Out).

% json_quote_atom(+Atom, -Quoted) wraps a plain ASCII atom (no embedded
% quotes/backslashes expected — these are all internal snake_case
% identifiers from facts.pl) in JSON string quotes.
json_quote_atom(Atom, Quoted) :-
    format(atom(Quoted), '"~w"', [Atom]).

% /country/:name - Implemented
handle_country(NameAtom, _Request) :-
    cors_enable,
    ( country_info(NameAtom, card(NameAtom, Capital, Currency, Flag, Region, IsMember, Facts)) ->
        json_unicode_escape(Flag, FlagEscaped),
        maplist(json_quote_atom, Facts, QuotedFacts),
        atomic_list_concat(QuotedFacts, ',', FactsJoined),
        format('Content-type: application/json~n~n'),
        format(
            '{"country":"~w","capital":"~w","currency":"~w","flag":"~w","region":"~w","asean_member":"~w","famous_for":[~w]}',
            [NameAtom, Capital, Currency, FlagEscaped, Region, IsMember, FactsJoined]
        )
    ; reply_json_dict(_{ error: "Country not found" }, [status(404)])
    ).
