:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_cors)).

:- set_setting(http:cors, [*]). % Allow CORS from any origin for development

:- [kb].

% Routes
:- http_handler(root(country/Name), handle_country(Name), []).
:- http_handler(root('guess'), guess_handler, []).
:- http_handler(root('neighbor_check'), neighbor_check_handler, []).

% Start Server on port 4000
server(Port) :-
    http_server(http_dispatch, [port(Port)]).

start_server :-
    server(4000).

% /country/:name - Implemented
handle_country(NameAtom, _Request) :-
    cors_enable,
    catch(
        ( country_info(NameAtom, card(NameAtom, Capital, Currency, Flag, Region, IsMember, Facts)) ->
            reply_json_dict(_{ country: NameAtom, capital: Capital, currency: Currency,
                                flag: Flag, region: Region, asean_member: IsMember,
                                famous_for: Facts })
        ; reply_json_dict(_{ error: "Country not found" }, [status(404)])
        ),
        error(existence_error(procedure, _), _),
        reply_json_dict(_{ error: "Backend logic not yet available" }, [status(503)])
    ).

% /guess - Placeholder for teammates
guess_handler(_Request) :-
    cors_enable,
    reply_json_dict(_{error: "Not implemented"}, [status(501)]).

% /neighbor_check - Placeholder for teammates
neighbor_check_handler(_Request) :-
    cors_enable,
    reply_json_dict(_{error: "Not implemented"}, [status(501)]).
