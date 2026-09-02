:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_cors)).
:- use_module(library(http/http_parameters)). % needed by features/explain_mode/routes.pl

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

% /country/:name - Implemented
handle_country(NameAtom, _Request) :-
    cors_enable,
    ( country_info(NameAtom, card(NameAtom, Capital, Currency, Flag, Region, IsMember, Facts)) ->
        reply_json_dict(_{ country: NameAtom, capital: Capital, currency: Currency,
                            flag: Flag, region: Region, asean_member: IsMember,
                            famous_for: Facts })
    ; reply_json_dict(_{ error: "Country not found" }, [status(404)])
    ).
