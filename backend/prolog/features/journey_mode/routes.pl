% backend/prolog/features/journey_mode/routes.pl
% NOT YET BUILT — placeholder route so the frontend's journeyApi.js has a real
% (if unimplemented) endpoint to point at. See rules.pl in this folder.

:- http_handler(root(journey/status), handle_journey_status, []).

% GET /journey/status
handle_journey_status(_Request) :-
    cors_enable,
    reply_json_dict(_{ error: "journey mode not implemented yet" }, [status(501)]).
