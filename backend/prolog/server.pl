:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_cors)).

:- set_setting(http:cors, [*]). % Allow CORS from any origin for development

:- [kb].

% Routes
:- http_handler(root('country/'), get_country_info, []).
:- http_handler(root('guess'), guess_handler, []).
:- http_handler(root('neighbor_check'), neighbor_check_handler, []).

% Start Server on port 4000
server(Port) :-
    http_server(http_dispatch, [port(Port)]).

start_server :-
    server(4000).

% /country/:name - Implemented
% Assumes country_info/2 is defined in rules.pl by teammates, returning a dict
get_country_info(Request) :-
    cors_enable,
    member(path(Path), Request),
    atomic_list_concat(['', 'country', CountryNameAtom], '/', Path),
    (   country_info(CountryNameAtom, InfoDict)
    ->  reply_json_dict(InfoDict)
    ;   reply_json_dict(_{error: "Country not found"}, [status(404)])
    ).

% /guess - Placeholder for teammates
guess_handler(_Request) :-
    cors_enable,
    reply_json_dict(_{error: "Not implemented"}, [status(501)]).

% /neighbor_check - Placeholder for teammates
neighbor_check_handler(_Request) :-
    cors_enable,
    reply_json_dict(_{error: "Not implemented"}, [status(501)]).
